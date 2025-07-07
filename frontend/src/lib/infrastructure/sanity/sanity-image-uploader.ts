import { createClient, SanityClient } from '@sanity/client';
import type { 
  ImageUploader,
  SanityAsset,
  UploadOptions,
  UploadProgress
} from './sanity-client.interface';
import type { SanityConfig } from '../../core/config/config.interface';
import { Image } from '../../domain/entities/image';
import type { UploadedMedia } from '../../domain/entities/media.interface';
import { 
  SanityAssetUploadError, 
  SanityConfigurationError,
  SanityApiError
} from '../../core/errors/sanity-error';
import type { Logger } from '../../core/logging/logger.interface';
import { createDefaultLogger } from '../../core/logging/console-logger';

/**
 * Sanity画像アップローダーの実装
 */
export class SanityImageUploader implements ImageUploader {
  private client: SanityClient;
  private config: SanityConfig;
  private logger: Logger;
  private progressCallback?: (progress: UploadProgress) => void;
  private defaultUploadOptions: Partial<UploadOptions> = {};

  constructor(config: SanityConfig, logger?: Logger) {
    this.config = config;
    this.logger = logger || createDefaultLogger().child('SanityImageUploader');
    
    // Sanityクライアントの初期化
    this.client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      token: config.token,
      useCdn: config.useCdn,
      timeout: config.timeout,
      retryDelay: config.retryDelay,
      maxRetries: config.retryAttempts
    });

    this.validateConfig();
  }

  async uploadImage(image: Image): Promise<UploadedMedia> {
    const stopTimer = this.logger.startTimer('uploadImage');

    try {
      if (!image.buffer) {
        throw new SanityAssetUploadError(
          'Image buffer is required for upload',
          'image',
          image.fileName
        );
      }

      this.notifyProgress({
        fileIndex: 0,
        totalFiles: 1,
        fileName: image.fileName,
        uploadedBytes: 0,
        totalBytes: image.fileSize,
        percentage: 0,
        stage: 'preparing'
      });

      const uploadOptions: UploadOptions = {
        filename: image.fileName,
        title: image.fileName,
        description: image.caption,
        creditLine: image.credits,
        ...this.defaultUploadOptions
      };

      this.notifyProgress({
        fileIndex: 0,
        totalFiles: 1,
        fileName: image.fileName,
        uploadedBytes: 0,
        totalBytes: image.fileSize,
        percentage: 0,
        stage: 'uploading'
      });

      // Sanityにアセットをアップロード
      const asset = await this.client.assets.upload('image', image.buffer, uploadOptions);

      this.notifyProgress({
        fileIndex: 0,
        totalFiles: 1,
        fileName: image.fileName,
        uploadedBytes: image.fileSize,
        totalBytes: image.fileSize,
        percentage: 100,
        stage: 'completed'
      });

      const uploadedMedia: UploadedMedia = {
        id: asset._id,
        url: asset.url,
        fileName: asset.originalFilename || image.fileName,
        fileSize: asset.size,
        mimeType: asset.mimeType,
        metadata: {
          fileName: asset.originalFilename || image.fileName,
          fileSize: asset.size,
          mimeType: asset.mimeType,
          format: asset.mimeType.split('/')[1],
          dimensions: asset.metadata?.dimensions ? {
            width: asset.metadata.dimensions.width,
            height: asset.metadata.dimensions.height
          } : undefined,
          hasAlpha: asset.metadata?.hasAlpha,
          created: new Date(),
          modified: new Date()
        },
        altText: image.getAltText(),
        caption: image.caption,
        credits: image.credits,
        uploadedAt: new Date(),
        sanityAssetId: asset._id
      };

      this.logger.info('Image uploaded successfully', 'uploadImage', {
        fileName: image.fileName,
        fileSize: image.fileSize,
        assetId: asset._id,
        url: asset.url
      });

      return uploadedMedia;
    } catch (error) {
      this.notifyProgress({
        fileIndex: 0,
        totalFiles: 1,
        fileName: image.fileName,
        uploadedBytes: 0,
        totalBytes: image.fileSize,
        percentage: 0,
        stage: 'error',
        error: error as Error
      });

      this.logger.error('Image upload failed', error as Error, 'uploadImage', {
        fileName: image.fileName,
        fileSize: image.fileSize
      });

      throw new SanityAssetUploadError(
        `Failed to upload image: ${image.fileName}`,
        'image',
        image.fileName,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async uploadImages(images: Image[]): Promise<UploadedMedia[]> {
    const stopTimer = this.logger.startTimer('uploadImages');

    try {
      this.logger.info(`Starting batch upload of ${images.length} images`, 'uploadImages');

      // 並列処理でアップロード（同時実行数を制限）
      const concurrency = Math.min(3, images.length); // 最大3並列
      const results: UploadedMedia[] = [];
      const errors: Error[] = [];

      for (let i = 0; i < images.length; i += concurrency) {
        const batch = images.slice(i, i + concurrency);
        
        const batchResults = await Promise.allSettled(
          batch.map(async (image, batchIndex) => {
            const overallIndex = i + batchIndex;
            
            // 進捗通知用にfileIndexを設定
            const originalCallback = this.progressCallback;
            this.progressCallback = (progress) => {
              if (originalCallback) {
                originalCallback({
                  ...progress,
                  fileIndex: overallIndex,
                  totalFiles: images.length
                });
              }
            };

            try {
              return await this.uploadImage(image);
            } finally {
              this.progressCallback = originalCallback;
            }
          })
        );

        // 結果を処理
        batchResults.forEach((result, batchIndex) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            errors.push(result.reason);
            this.logger.error('Batch upload item failed', result.reason, 'uploadImages', {
              imageIndex: i + batchIndex,
              fileName: batch[batchIndex].fileName
            });
          }
        });
      }

      this.logger.info('Batch upload completed', 'uploadImages', {
        totalImages: images.length,
        successCount: results.length,
        errorCount: errors.length
      });

      if (errors.length > 0 && results.length === 0) {
        throw new SanityAssetUploadError(
          `All ${images.length} image uploads failed`,
          'batch',
          undefined,
          errors[0]
        );
      }

      if (errors.length > 0) {
        this.logger.warn(`${errors.length} out of ${images.length} uploads failed`, 'uploadImages');
      }

      return results;
    } catch (error) {
      this.logger.error('Batch image upload failed', error as Error, 'uploadImages');
      throw error;
    } finally {
      stopTimer();
    }
  }

  async replaceImage(oldAssetId: string, newImage: Image): Promise<UploadedMedia> {
    const stopTimer = this.logger.startTimer('replaceImage');

    try {
      this.logger.info('Replacing image asset', 'replaceImage', {
        oldAssetId,
        newFileName: newImage.fileName
      });

      // 新しい画像をアップロード
      const uploadedMedia = await this.uploadImage(newImage);

      // 古いアセットを削除
      try {
        await this.deleteImage(oldAssetId);
        this.logger.debug('Old asset deleted successfully', 'replaceImage', { oldAssetId });
      } catch (deleteError) {
        this.logger.warn('Failed to delete old asset', deleteError as Error, 'replaceImage', {
          oldAssetId
        });
        // 削除に失敗しても新しいアップロードは成功しているので続行
      }

      return uploadedMedia;
    } catch (error) {
      this.logger.error('Image replacement failed', error as Error, 'replaceImage');
      throw error;
    } finally {
      stopTimer();
    }
  }

  async deleteImage(assetId: string): Promise<void> {
    const stopTimer = this.logger.startTimer('deleteImage');

    try {
      await this.client.delete(assetId);
      
      this.logger.info('Image asset deleted successfully', 'deleteImage', { assetId });
    } catch (error) {
      this.logger.error('Image deletion failed', error as Error, 'deleteImage', { assetId });
      throw new SanityAssetUploadError(
        `Failed to delete image asset: ${assetId}`,
        'image',
        undefined,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  onProgress(callback: (progress: UploadProgress) => void): void {
    this.progressCallback = callback;
  }

  setUploadOptions(options: Partial<UploadOptions>): void {
    this.defaultUploadOptions = { ...this.defaultUploadOptions, ...options };
    this.logger.debug('Upload options updated', 'setUploadOptions', { options });
  }

  /**
   * アセット情報を取得
   */
  async getAssetInfo(assetId: string): Promise<SanityAsset | null> {
    const stopTimer = this.logger.startTimer('getAssetInfo');

    try {
      const asset = await this.client.getDocument<SanityAsset>(assetId);
      return asset || null;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      this.logger.error('Failed to get asset info', error as Error, 'getAssetInfo', { assetId });
      throw new SanityApiError(
        `Failed to get asset info: ${assetId}`,
        'getDocument',
        undefined,
        error
      );
    } finally {
      stopTimer();
    }
  }

  /**
   * アセット一覧を取得
   */
  async listAssets(options?: {
    limit?: number;
    offset?: number;
    filter?: string;
  }): Promise<SanityAsset[]> {
    const stopTimer = this.logger.startTimer('listAssets');

    try {
      let query = '*[_type == "sanity.imageAsset"]';
      
      if (options?.filter) {
        query += ` && ${options.filter}`;
      }
      
      query += ` | order(_createdAt desc)`;
      
      if (options?.offset) {
        query += `[${options.offset}...`;
        if (options.limit) {
          query += `${options.offset + options.limit}]`;
        } else {
          query += ']';
        }
      } else if (options?.limit) {
        query += `[0...${options.limit}]`;
      }

      const assets = await this.client.fetch<SanityAsset[]>(query);
      
      this.logger.debug('Assets listed successfully', 'listAssets', {
        count: assets.length,
        query
      });

      return assets;
    } catch (error) {
      this.logger.error('Failed to list assets', error as Error, 'listAssets');
      throw new SanityApiError(
        'Failed to list assets',
        'fetch',
        undefined,
        error
      );
    } finally {
      stopTimer();
    }
  }

  /**
   * 未使用アセットを検索
   */
  async findUnusedAssets(): Promise<SanityAsset[]> {
    const stopTimer = this.logger.startTimer('findUnusedAssets');

    try {
      const query = `
        *[_type == "sanity.imageAsset" && !defined(*[references(^._id)][0]._id)]
        | order(_createdAt desc)
      `;

      const unusedAssets = await this.client.fetch<SanityAsset[]>(query);

      this.logger.info('Unused assets found', 'findUnusedAssets', {
        count: unusedAssets.length
      });

      return unusedAssets;
    } catch (error) {
      this.logger.error('Failed to find unused assets', error as Error, 'findUnusedAssets');
      throw new SanityApiError(
        'Failed to find unused assets',
        'fetch',
        undefined,
        error
      );
    } finally {
      stopTimer();
    }
  }

  /**
   * 未使用アセットを一括削除
   */
  async cleanupUnusedAssets(): Promise<{ deletedCount: number; errors: Error[] }> {
    const stopTimer = this.logger.startTimer('cleanupUnusedAssets');

    try {
      const unusedAssets = await this.findUnusedAssets();
      
      if (unusedAssets.length === 0) {
        this.logger.info('No unused assets found to cleanup', 'cleanupUnusedAssets');
        return { deletedCount: 0, errors: [] };
      }

      const errors: Error[] = [];
      let deletedCount = 0;

      // バッチサイズを制限して削除
      const batchSize = 10;
      for (let i = 0; i < unusedAssets.length; i += batchSize) {
        const batch = unusedAssets.slice(i, i + batchSize);
        
        const results = await Promise.allSettled(
          batch.map(asset => this.deleteImage(asset._id))
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            deletedCount++;
          } else {
            errors.push(result.reason);
          }
        });
      }

      this.logger.info('Asset cleanup completed', 'cleanupUnusedAssets', {
        totalAssets: unusedAssets.length,
        deletedCount,
        errorCount: errors.length
      });

      return { deletedCount, errors };
    } catch (error) {
      this.logger.error('Asset cleanup failed', error as Error, 'cleanupUnusedAssets');
      throw error;
    } finally {
      stopTimer();
    }
  }

  // プライベートメソッド

  private validateConfig(): void {
    if (!this.config.projectId) {
      throw new SanityConfigurationError('Sanity project ID is required', 'projectId');
    }
    if (!this.config.token) {
      throw new SanityConfigurationError('Sanity token is required', 'token');
    }
    if (!this.config.dataset) {
      throw new SanityConfigurationError('Sanity dataset is required', 'dataset');
    }
  }

  private notifyProgress(progress: UploadProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  private isNotFoundError(error: unknown): boolean {
    return (error as { statusCode?: number; response?: { statusCode?: number } })?.statusCode === 404 || 
           (error as { statusCode?: number; response?: { statusCode?: number } })?.response?.statusCode === 404;
  }
}

/**
 * ファクトリー関数
 */
export function createSanityImageUploader(config: SanityConfig, logger?: Logger): SanityImageUploader {
  return new SanityImageUploader(config, logger);
}