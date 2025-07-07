import { promises as fs } from 'fs';
import path from 'path';
import { 
  ImageProcessor,
  ValidationOptions,
  AnalysisOptions,
  ImageProcessingOptions
} from '../../infrastructure/image-processing/image-processor.interface';
import { SharpImageProcessor } from '../../infrastructure/image-processing/sharp-processor';
import { SanityImageUploader } from '../../infrastructure/sanity/sanity-image-uploader';
import { SanityArticlePublisher } from '../../infrastructure/sanity/sanity-article-publisher';
import { Article, ArticleBuilder, ArticleCategory } from '../../domain/entities/article';
import { Image } from '../../domain/entities/image';
import { 
  ImageReference, 
  UploadedMedia, 
  ImagePlacement, 
  OptimizationOptions 
} from '../../domain/entities/media.interface';
import { ApplicationConfig } from '../../core/config/config.interface';
import { Logger } from '../../core/logging/logger.interface';
import { createDefaultLogger } from '../../core/logging/console-logger';
import { ImageValidationError, ImageProcessingError } from '../../core/errors/image-error';
import { BaseError } from '../../core/errors/base-error';

/**
 * 記事作成のリクエスト
 */
export interface CreateArticleRequest {
  title: string;
  content: string;
  category: ArticleCategory;
  tags?: string[];
  images?: ImageReference[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  publish?: boolean;
  optimizeImages?: boolean;
  analyzeImages?: boolean;
}

/**
 * 記事作成の結果
 */
export interface CreateArticleResult {
  success: boolean;
  article?: {
    id: string;
    title: string;
    slug: string;
    url: string;
    status: string;
    publishedAt?: Date;
  };
  uploadedImages: Array<{
    originalPath: string;
    uploadedMedia: UploadedMedia;
    processingStats?: {
      originalSize: number;
      processedSize: number;
      compressionRatio: number;
      processingTime: number;
    };
  }>;
  errors: string[];
  warnings: string[];
  performance: {
    totalTime: number;
    imageProcessingTime: number;
    uploadTime: number;
    articleCreationTime: number;
  };
}

/**
 * 画像付き記事作成のユースケース
 */
export class CreateArticleWithImagesUseCase {
  private imageProcessor: ImageProcessor;
  private imageUploader: SanityImageUploader;
  private articlePublisher: SanityArticlePublisher;
  private config: ApplicationConfig;
  private logger: Logger;

  constructor(
    config: ApplicationConfig,
    imageProcessor?: ImageProcessor,
    imageUploader?: SanityImageUploader,
    articlePublisher?: SanityArticlePublisher,
    logger?: Logger
  ) {
    this.config = config;
    this.logger = logger || createDefaultLogger().child('CreateArticleWithImages');
    
    this.imageProcessor = imageProcessor || new SharpImageProcessor(this.logger);
    this.imageUploader = imageUploader || new SanityImageUploader(config.sanity, this.logger);
    this.articlePublisher = articlePublisher || new SanityArticlePublisher(config.sanity, this.logger);
  }

  async execute(request: CreateArticleRequest): Promise<CreateArticleResult> {
    const stopTimer = this.logger.startTimer('execute');
    const startTime = Date.now();
    
    const result: CreateArticleResult = {
      success: false,
      uploadedImages: [],
      errors: [],
      warnings: [],
      performance: {
        totalTime: 0,
        imageProcessingTime: 0,
        uploadTime: 0,
        articleCreationTime: 0
      }
    };

    try {
      this.logger.info('Starting article creation with images', 'execute', {
        title: request.title,
        category: request.category,
        imageCount: request.images?.length || 0,
        publish: request.publish
      });

      // 1. 入力の検証
      const validationResult = this.validateRequest(request);
      if (!validationResult.isValid) {
        result.errors = validationResult.errors;
        result.warnings = validationResult.warnings;
        return result;
      }

      // 2. 画像の処理
      let processedImages: Image[] = [];
      if (request.images && request.images.length > 0) {
        const imageProcessingStart = Date.now();
        
        try {
          processedImages = await this.processImages(request.images, {
            optimize: request.optimizeImages !== false,
            analyze: request.analyzeImages !== false
          });
        } catch (error) {
          this.logger.error('Image processing failed', error as Error, 'execute');
          result.errors.push(`Image processing failed: ${(error as Error).message}`);
          return result;
        }

        result.performance.imageProcessingTime = Date.now() - imageProcessingStart;
      }

      // 3. 記事の作成
      const articleCreationStart = Date.now();
      
      const article = new ArticleBuilder()
        .setTitle(request.title)
        .setCategory(request.category)
        .setContent(this.parseContentToPortableText(request.content))
        .setSEO({
          metaTitle: request.seo?.metaTitle || request.title,
          metaDescription: request.seo?.metaDescription || this.generateExcerpt(request.content)
        })
        .build();

      // タグの追加
      if (request.tags) {
        request.tags.forEach(tag => article.addTag(tag));
      }

      result.performance.articleCreationTime = Date.now() - articleCreationStart;

      // 4. 画像のアップロードと記事への統合
      const uploadStart = Date.now();
      
      let uploadedImages: UploadedMedia[] = [];
      if (processedImages.length > 0) {
        try {
          const uploadResult = await this.articlePublisher.createArticleWithAssets(
            article,
            processedImages
          );

          // アップロード結果を整理
          uploadedImages = uploadResult.uploadedImages;
          result.uploadedImages = this.createUploadSummary(request.images || [], uploadedImages, processedImages);

          // 記事オブジェクトを更新
          const publishedArticle = uploadResult.article;
          result.article = {
            id: publishedArticle._id,
            title: publishedArticle.title,
            slug: publishedArticle.slug.current,
            url: `/${publishedArticle.slug.current}`,
            status: publishedArticle.status,
            publishedAt: publishedArticle.publishedAt ? new Date(publishedArticle.publishedAt) : undefined
          };

        } catch (error) {
          this.logger.error('Failed to upload images and create article', error as Error, 'execute');
          result.errors.push(`Upload failed: ${(error as Error).message}`);
          return result;
        }
      } else {
        // 画像なしの記事作成
        try {
          const publishedArticle = request.publish 
            ? await this.articlePublisher.createAndPublish(article)
            : await this.articlePublisher.createDraft(article);

          result.article = {
            id: publishedArticle._id,
            title: publishedArticle.title,
            slug: publishedArticle.slug.current,
            url: `/${publishedArticle.slug.current}`,
            status: publishedArticle.status,
            publishedAt: publishedArticle.publishedAt ? new Date(publishedArticle.publishedAt) : undefined
          };
        } catch (error) {
          this.logger.error('Failed to create article', error as Error, 'execute');
          result.errors.push(`Article creation failed: ${(error as Error).message}`);
          return result;
        }
      }

      result.performance.uploadTime = Date.now() - uploadStart;

      // 5. 最終検証
      if (result.article) {
        const articleValidation = await this.articlePublisher.validateArticle(article);
        result.warnings.push(...articleValidation.warnings);
      }

      result.success = true;
      result.performance.totalTime = Date.now() - startTime;

      this.logger.info('Article creation completed successfully', 'execute', {
        articleId: result.article?.id,
        title: request.title,
        uploadedImagesCount: uploadedImages.length,
        totalTime: result.performance.totalTime
      });

      return result;

    } catch (error) {
      this.logger.error('Article creation failed', error as Error, 'execute');
      result.errors.push(`System error: ${(error as Error).message}`);
      result.performance.totalTime = Date.now() - startTime;
      return result;
    } finally {
      stopTimer();
    }
  }

  // プライベートメソッド

  private validateRequest(request: CreateArticleRequest): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 必須フィールドの検証
    if (!request.title?.trim()) {
      errors.push('Title is required');
    }

    if (request.title && request.title.length > 100) {
      warnings.push('Title is longer than recommended (100 characters)');
    }

    if (!request.content?.trim()) {
      errors.push('Content is required');
    }

    if (request.content && request.content.length < 100) {
      warnings.push('Content is quite short (less than 100 characters)');
    }

    if (!request.category) {
      errors.push('Category is required');
    }

    // 画像の基本検証
    if (request.images) {
      for (let i = 0; i < request.images.length; i++) {
        const image = request.images[i];
        if (!image.filePath) {
          errors.push(`Image ${i + 1}: File path is required`);
        }
      }
    }

    // SEO検証
    if (request.seo?.metaTitle && request.seo.metaTitle.length > 60) {
      warnings.push('Meta title is longer than recommended (60 characters)');
    }

    if (request.seo?.metaDescription && request.seo.metaDescription.length > 160) {
      warnings.push('Meta description is longer than recommended (160 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async processImages(
    imageReferences: ImageReference[], 
    options: { optimize: boolean; analyze: boolean }
  ): Promise<Image[]> {
    const stopTimer = this.logger.startTimer('processImages');

    try {
      const processedImages: Image[] = [];

      for (const imageRef of imageReferences) {
        try {
          // ファイルの読み込み
          const buffer = await fs.readFile(imageRef.filePath);
          
          // 画像エンティティの作成
          const image = await Image.fromFile(imageRef.filePath, buffer);
          
          // altテキストとキャプションの設定
          if (imageRef.altText) {
            image.altText = imageRef.altText;
          }
          if (imageRef.caption) {
            image.caption = imageRef.caption;
          }

          // バリデーション
          const validationOptions: ValidationOptions = {
            maxFileSize: this.config.image.maxFileSize,
            allowedFormats: this.config.security.allowedFileTypes,
            maxDimensions: {
              width: this.config.image.resize.maxWidth,
              height: this.config.image.resize.maxHeight
            }
          };

          const validationResult = await this.imageProcessor.validate(buffer, validationOptions);
          if (!validationResult.isValid) {
            throw new ImageValidationError(
              `Image validation failed: ${imageRef.filePath}`,
              validationResult.errors.map(error => ({ field: 'image', message: error, value: imageRef.filePath }))
            );
          }

          // 最適化
          if (options.optimize && image.shouldOptimize()) {
            const optimizationOptions: OptimizationOptions = {
              quality: this.config.image.optimizationQuality,
              progressive: this.config.image.compression.enabled,
              resize: image.getDimensions() ? {
                width: Math.min(image.getDimensions()!.width, this.config.image.resize.maxWidth),
                height: Math.min(image.getDimensions()!.height, this.config.image.resize.maxHeight),
                maintainAspectRatio: this.config.image.resize.maintainAspectRatio
              } : undefined
            };

            const optimizedImage = await this.imageProcessor.optimize(image, optimizationOptions);
            processedImages.push(optimizedImage);
          } else {
            processedImages.push(image);
          }

          // 画像解析
          if (options.analyze && this.config.image.autoGenerateAlt) {
            try {
              const analysisOptions: AnalysisOptions = {
                generateAltText: true,
                detectObjects: false,
                analyzeColors: true,
                extractText: false,
                analyzeSentiment: false,
                suggestPlacement: true
              };

              const analysis = await this.imageProcessor.analyze(buffer, analysisOptions);
              image.analysis = analysis;

              if (!image.altText && analysis.suggestedAltText) {
                image.altText = analysis.suggestedAltText;
              }
            } catch (analysisError) {
              this.logger.warn('Image analysis failed', analysisError as Error, 'processImages', {
                imagePath: imageRef.filePath
              });
              // 解析の失敗は処理を停止しない
            }
          }

        } catch (error) {
          this.logger.error('Failed to process image', error as Error, 'processImages', {
            imagePath: imageRef.filePath
          });
          throw new ImageProcessingError(
            `Failed to process image: ${imageRef.filePath}`,
            'processing',
            error as Error
          );
        }
      }

      this.logger.info('Image processing completed', 'processImages', {
        totalImages: imageReferences.length,
        processedImages: processedImages.length
      });

      return processedImages;
    } catch (error) {
      this.logger.error('Image batch processing failed', error as Error, 'processImages');
      throw error;
    } finally {
      stopTimer();
    }
  }

  private parseContentToPortableText(content: string): any[] {
    // 基本的なMarkdown to PortableText変換
    const lines = content.split('\n');
    const blocks: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('# ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h1',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(2) }]
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h2',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(3) }]
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h3',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(4) }]
        });
      } else {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'normal',
          children: [{ _type: 'span', _key: `span_${i}`, text: line }]
        });
      }
    }

    return blocks;
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    // HTMLタグとMarkdownマークアップを削除
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Markdownヘッダー
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`([^`]+)`/g, '$1') // Inline code
      .replace(/\n+/g, ' ') // 改行をスペースに
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  private createUploadSummary(
    originalRefs: ImageReference[],
    uploadedImages: UploadedMedia[],
    processedImages: Image[]
  ): CreateArticleResult['uploadedImages'] {
    return originalRefs.map((ref, index) => {
      const uploadedMedia = uploadedImages[index];
      const processedImage = processedImages[index];

      let processingStats;
      if (processedImage && 'originalImage' in processedImage) {
        const processed = processedImage as any; // ProcessedImage
        processingStats = {
          originalSize: processed.originalImage.fileSize,
          processedSize: processed.fileSize,
          compressionRatio: processed.sizeDifference.compressionRatio,
          processingTime: processed.processingTime
        };
      }

      return {
        originalPath: ref.filePath,
        uploadedMedia,
        processingStats
      };
    });
  }
}

/**
 * ファクトリー関数
 */
export function createArticleWithImagesUseCase(config: ApplicationConfig, logger?: Logger): CreateArticleWithImagesUseCase {
  return new CreateArticleWithImagesUseCase(config, undefined, undefined, undefined, logger);
}