import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import type { 
  ImageProcessor,
  ValidationOptions,
  AnalysisOptions,
  ConversionOptions,
  ResizeOptions,
  WatermarkOptions,
  ImageProcessingOptions
} from './image-processor.interface';
import type { 
  MediaMetadata, 
  MediaValidationResult, 
  MediaProcessingResult,
  OptimizationOptions,
  ImageAnalysis,
  ImagePlacement
} from '../../domain/entities/media.interface';
import { ImagePlacements } from '../../domain/entities/media.interface';
import { Image, ProcessedImage } from '../../domain/entities/image';
import { 
  ImageValidationError, 
  ImageFormatError, 
  ImageProcessingError 
} from '../../core/errors/image-error';
import type { Logger } from '../../core/logging/logger.interface';
import { createDefaultLogger } from '../../core/logging/console-logger';

/**
 * Sharp ベースの画像処理実装
 */
export class SharpImageProcessor implements ImageProcessor {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || createDefaultLogger().child('SharpImageProcessor');
  }

  async getMetadata(buffer: Buffer): Promise<MediaMetadata> {
    const stopTimer = this.logger.startTimer('getMetadata');

    try {
      const [sharpMetadata, fileType] = await Promise.all([
        sharp(buffer).metadata(),
        fileTypeFromBuffer(buffer)
      ]);

      const metadata: MediaMetadata = {
        fileName: 'unknown',
        fileSize: buffer.length,
        mimeType: fileType?.mime || 'application/octet-stream',
        format: fileType?.ext || 'unknown',
        dimensions: sharpMetadata.width && sharpMetadata.height ? {
          width: sharpMetadata.width,
          height: sharpMetadata.height
        } : undefined,
        colorSpace: sharpMetadata.space,
        hasAlpha: sharpMetadata.hasAlpha,
        density: sharpMetadata.density,
        created: new Date(),
        modified: new Date()
      };

      this.logger.debug('Image metadata extracted', 'getMetadata', { metadata });
      return metadata;
    } catch (error) {
      this.logger.error('Failed to extract metadata', error as Error, 'getMetadata');
      throw new ImageProcessingError(
        'Failed to extract image metadata',
        'metadata_extraction',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async validate(buffer: Buffer, options: ValidationOptions): Promise<MediaValidationResult> {
    const stopTimer = this.logger.startTimer('validate');
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // ファイルサイズチェック
      if (buffer.length > options.maxFileSize) {
        errors.push(`File size ${buffer.length} exceeds maximum ${options.maxFileSize}`);
      }

      // ファイルタイプチェック
      const fileType = await fileTypeFromBuffer(buffer);
      if (!fileType || !options.allowedFormats.includes(fileType.mime)) {
        errors.push(`Unsupported file format: ${fileType?.mime || 'unknown'}`);
      }

      // 画像メタデータチェック
      const metadata = await this.getMetadata(buffer);
      const dimensions = metadata.dimensions;

      if (dimensions) {
        // 最大サイズチェック
        if (options.maxDimensions) {
          if (dimensions.width > options.maxDimensions.width || 
              dimensions.height > options.maxDimensions.height) {
            errors.push(`Image dimensions ${dimensions.width}x${dimensions.height} exceed maximum ${options.maxDimensions.width}x${options.maxDimensions.height}`);
          }
        }

        // 最小サイズチェック
        if (options.minDimensions) {
          if (dimensions.width < options.minDimensions.width || 
              dimensions.height < options.minDimensions.height) {
            errors.push(`Image dimensions ${dimensions.width}x${dimensions.height} below minimum ${options.minDimensions.width}x${options.minDimensions.height}`);
          }
        }
      }

      // アニメーションGIFチェック
      if (!options.allowAnimated && fileType?.mime === 'image/gif') {
        const sharpMetadata = await sharp(buffer).metadata();
        if (sharpMetadata.pages && sharpMetadata.pages > 1) {
          errors.push('Animated GIFs are not allowed');
        }
      }

      const result: MediaValidationResult = {
        isValid: errors.length === 0,
        errors,
        warnings,
        metadata
      };

      this.logger.debug('Image validation completed', 'validate', { 
        isValid: result.isValid, 
        errorCount: errors.length,
        warningCount: warnings.length
      });

      return result;
    } catch (error) {
      this.logger.error('Image validation failed', error as Error, 'validate');
      throw new ImageValidationError('Image validation failed', [
        { field: 'buffer', message: (error as Error).message, value: buffer.length }
      ]);
    } finally {
      stopTimer();
    }
  }

  async optimize(image: Image, options: OptimizationOptions): Promise<ProcessedImage> {
    const stopTimer = this.logger.startTimer('optimize');

    try {
      if (!image.buffer) {
        throw new ImageProcessingError('Image buffer is required for optimization', 'missing_buffer');
      }

      let processor = sharp(image.buffer);
      
      // リサイズ処理
      if (options.resize) {
        processor = processor.resize({
          width: options.resize.width,
          height: options.resize.height,
          fit: options.resize.maintainAspectRatio ? 'inside' : 'fill',
          withoutEnlargement: true
        });
      }

      // フォーマット変換と圧縮
      switch (options.format || image.getFormat()) {
        case 'jpeg':
          processor = processor.jpeg({
            quality: options.quality,
            progressive: options.progressive || false
          });
          break;
        case 'png':
          processor = processor.png({
            quality: options.quality,
            progressive: options.progressive || false
          });
          break;
        case 'webp':
          processor = processor.webp({
            quality: options.quality
          });
          break;
        case 'gif':
          // GIF は sharp での最適化が限定的
          break;
      }

      const startTime = Date.now();
      const processedBuffer = await processor.toBuffer();
      const processingTime = Date.now() - startTime;

      const processedMetadata = await this.getMetadata(processedBuffer);

      const processedImage = new ProcessedImage(image, {
        buffer: processedBuffer,
        metadata: processedMetadata,
        optimizationApplied: options,
        processingTime
      });

      this.logger.info(`Image optimized successfully`, 'optimize', {
        originalSize: image.fileSize,
        processedSize: processedBuffer.length,
        compressionRatio: processedImage.sizeDifference.compressionRatio,
        processingTime
      });

      return processedImage;
    } catch (error) {
      this.logger.error('Image optimization failed', error as Error, 'optimize');
      throw new ImageProcessingError(
        'Image optimization failed',
        'optimization',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async resize(buffer: Buffer, options: ResizeOptions): Promise<Buffer> {
    const stopTimer = this.logger.startTimer('resize');

    try {
      const processor = sharp(buffer).resize({
        width: options.width,
        height: options.height,
        fit: options.fit || 'cover',
        position: options.position || 'center',
        background: options.background || { r: 255, g: 255, b: 255, alpha: 1 },
        withoutEnlargement: options.withoutEnlargement || false
      });

      const result = await processor.toBuffer();
      
      this.logger.debug('Image resized successfully', 'resize', {
        originalSize: buffer.length,
        processedSize: result.length,
        options
      });

      return result;
    } catch (error) {
      this.logger.error('Image resize failed', error as Error, 'resize');
      throw new ImageProcessingError(
        'Image resize failed',
        'resize',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async convert(buffer: Buffer, options: ConversionOptions): Promise<Buffer> {
    const stopTimer = this.logger.startTimer('convert');

    try {
      let processor = sharp(buffer);

      switch (options.format) {
        case 'jpeg':
          processor = processor.jpeg({
            quality: options.quality || 85,
            progressive: options.progressive || false
          });
          break;
        case 'png':
          processor = processor.png({
            compressionLevel: options.compressionLevel || 6,
            progressive: options.progressive || false
          });
          break;
        case 'webp':
          processor = processor.webp({
            quality: options.quality || 85
          });
          break;
        default:
          throw new ImageFormatError(
            options.format || 'unknown',
            ['jpeg', 'png', 'webp']
          );
      }

      const result = await processor.toBuffer();
      
      this.logger.debug('Image converted successfully', 'convert', {
        targetFormat: options.format,
        originalSize: buffer.length,
        processedSize: result.length
      });

      return result;
    } catch (error) {
      this.logger.error('Image conversion failed', error as Error, 'convert');
      throw new ImageProcessingError(
        'Image format conversion failed',
        'conversion',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async compress(buffer: Buffer, quality: number): Promise<Buffer> {
    const stopTimer = this.logger.startTimer('compress');

    try {
      const metadata = await sharp(buffer).metadata();
      let processor = sharp(buffer);

      // フォーマットに応じた圧縮
      switch (metadata.format) {
        case 'jpeg':
          processor = processor.jpeg({ quality });
          break;
        case 'png':
          processor = processor.png({ 
            quality, 
            compressionLevel: Math.floor(quality / 10) 
          });
          break;
        case 'webp':
          processor = processor.webp({ quality });
          break;
        default:
          // サポートされていないフォーマットの場合、WebPに変換
          processor = processor.webp({ quality });
          break;
      }

      const result = await processor.toBuffer();
      
      this.logger.debug('Image compressed successfully', 'compress', {
        quality,
        originalSize: buffer.length,
        compressedSize: result.length,
        compressionRatio: Math.round((1 - result.length / buffer.length) * 100)
      });

      return result;
    } catch (error) {
      this.logger.error('Image compression failed', error as Error, 'compress');
      throw new ImageProcessingError(
        'Image compression failed',
        'compression',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async addWatermark(buffer: Buffer, options: WatermarkOptions): Promise<Buffer> {
    const stopTimer = this.logger.startTimer('addWatermark');

    try {
      const image = sharp(buffer);
      const { width, height } = await image.metadata();

      if (!width || !height) {
        throw new ImageProcessingError('Could not determine image dimensions', 'watermark');
      }

      let watermarkBuffer: Buffer;

      if (options.image) {
        // 画像の透かし
        const watermarkSize = options.size || Math.min(width, height) * 0.2;
        watermarkBuffer = await sharp(options.image)
          .resize(watermarkSize, watermarkSize, { fit: 'inside' })
          .toBuffer();
      } else if (options.text) {
        // テキストの透かし（SVGで作成）
        const fontSize = options.size || 24;
        const svg = `
          <svg width="200" height="50">
            <text x="10" y="30" font-family="Arial" font-size="${fontSize}" fill="white" opacity="${options.opacity || 0.5}">
              ${options.text}
            </text>
          </svg>
        `;
        watermarkBuffer = Buffer.from(svg);
      } else {
        throw new ImageProcessingError('Either image or text must be provided for watermark', 'watermark');
      }

      // 位置の計算
      const gravity = this.getGravityFromPosition(options.position || 'bottom-right');

      const result = await image
        .composite([{
          input: watermarkBuffer,
          gravity: gravity,
          blend: 'over'
        }])
        .toBuffer();

      this.logger.debug('Watermark added successfully', 'addWatermark', {
        position: options.position,
        opacity: options.opacity
      });

      return result;
    } catch (error) {
      this.logger.error('Adding watermark failed', error as Error, 'addWatermark');
      throw new ImageProcessingError(
        'Adding watermark failed',
        'watermark',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async analyze(buffer: Buffer, options: AnalysisOptions): Promise<ImageAnalysis> {
    const stopTimer = this.logger.startTimer('analyze');

    try {
      const metadata = await this.getMetadata(buffer);

      // 基本的な分析（実際の実装ではAI APIを使用）
      const analysis: ImageAnalysis = {
        description: await this.generateDescription(buffer, metadata),
        suggestedAltText: await this.generateAltText(buffer, options),
        detectedObjects: options.detectObjects ? await this.detectObjects() : [],
        dominantColors: options.analyzeColors ? await this.analyzeDominantColors(buffer) : [],
        textContent: options.extractText ? await this.extractText() : undefined,
        sentiment: options.analyzeSentiment ? await this.analyzeSentiment() : undefined,
        appropriateForContent: true, // 基本的には適切と判定
        suggestedPlacement: this.suggestPlacement(metadata),
        confidence: 0.7 // 基本実装では中程度の信頼度
      };

      this.logger.debug('Image analysis completed', 'analyze', {
        detectedObjectsCount: analysis.detectedObjects.length,
        dominantColorsCount: analysis.dominantColors.length,
        confidence: analysis.confidence
      });

      return analysis;
    } catch (error) {
      this.logger.error('Image analysis failed', error as Error, 'analyze');
      throw new ImageProcessingError(
        'Image analysis failed',
        'analysis',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async generateThumbnail(buffer: Buffer, size: number): Promise<Buffer> {
    const stopTimer = this.logger.startTimer('generateThumbnail');

    try {
      const result = await sharp(buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      this.logger.debug('Thumbnail generated successfully', 'generateThumbnail', {
        size,
        originalSize: buffer.length,
        thumbnailSize: result.length
      });

      return result;
    } catch (error) {
      this.logger.error('Thumbnail generation failed', error as Error, 'generateThumbnail');
      throw new ImageProcessingError(
        'Thumbnail generation failed',
        'thumbnail',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async generateVariations(buffer: Buffer, variations: Array<{
    name: string;
    options: ResizeOptions & ConversionOptions;
  }>): Promise<Array<{
    name: string;
    buffer: Buffer;
    metadata: MediaMetadata;
  }>> {
    const stopTimer = this.logger.startTimer('generateVariations');

    try {
      const results = await Promise.all(
        variations.map(async (variation) => {
          let processor = sharp(buffer);

          // リサイズ
          if (variation.options.width || variation.options.height) {
            processor = processor.resize({
              width: variation.options.width,
              height: variation.options.height,
              fit: variation.options.fit || 'cover'
            });
          }

          // フォーマット変換
          if (variation.options.format) {
            switch (variation.options.format) {
              case 'jpeg':
                processor = processor.jpeg({ quality: variation.options.quality || 85 });
                break;
              case 'png':
                processor = processor.png();
                break;
              case 'webp':
                processor = processor.webp({ quality: variation.options.quality || 85 });
                break;
            }
          }

          const processedBuffer = await processor.toBuffer();
          const metadata = await this.getMetadata(processedBuffer);

          return {
            name: variation.name,
            buffer: processedBuffer,
            metadata
          };
        })
      );

      this.logger.info('Image variations generated successfully', 'generateVariations', {
        variationCount: variations.length,
        totalSize: results.reduce((sum, r) => sum + r.buffer.length, 0)
      });

      return results;
    } catch (error) {
      this.logger.error('Variation generation failed', error as Error, 'generateVariations');
      throw new ImageProcessingError(
        'Image variation generation failed',
        'variations',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async processBatch(images: Array<{
    image: Image;
    options: ImageProcessingOptions;
  }>): Promise<MediaProcessingResult[]> {
    const stopTimer = this.logger.startTimer('processBatch');

    try {
      const results = await Promise.allSettled(
        images.map(async ({ image, options }) => {
          if (options.optimization) {
            return await this.optimize(image, options.optimization);
          }
          return image;
        })
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const errorCount = results.filter(r => r.status === 'rejected').length;

      this.logger.info('Batch processing completed', 'processBatch', {
        totalImages: images.length,
        successCount,
        errorCount
      });

      return results.map((result) => ({
        success: result.status === 'fulfilled',
        media: undefined, // TODO: Convert Image/ProcessedImage to ProcessedMedia
        error: result.status === 'rejected' ? result.reason : undefined,
        warnings: [],
        processingSteps: ['optimization'],
        performance: {
          totalTime: 0,
          validationTime: 0,
          processingTime: 0,
          optimizationTime: 0
        }
      }));
    } catch (error) {
      this.logger.error('Batch processing failed', error as Error, 'processBatch');
      throw new ImageProcessingError(
        'Batch image processing failed',
        'batch',
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  // プライベートメソッド

  private getGravityFromPosition(position: string): string {
    const positionMap: Record<string, string> = {
      'top-left': 'northwest',
      'top-right': 'northeast',
      'bottom-left': 'southwest',
      'bottom-right': 'southeast',
      'center': 'center'
    };
    return positionMap[position] || 'southeast';
  }

  private async generateDescription(_buffer: Buffer, metadata: MediaMetadata): Promise<string> {
    // 基本的な説明生成（実際の実装では画像認識AIを使用）
    const dimensions = metadata.dimensions;
    if (dimensions) {
      const aspectRatio = dimensions.width / dimensions.height;
      if (aspectRatio > 1.5) {
        return 'A landscape-oriented image suitable for wide displays';
      } else if (aspectRatio < 0.7) {
        return 'A portrait-oriented image suitable for vertical layouts';
      } else {
        return 'A square or near-square image suitable for various layouts';
      }
    }
    return 'An image file';
  }

  private async generateAltText(_buffer: Buffer, options: AnalysisOptions): Promise<string> {
    if (!options.generateAltText) {
      return 'Image';
    }
    
    // 基本的なalt text生成（実際の実装では画像認識AIを使用）
    const metadata = await this.getMetadata(_buffer);
    return `Image (${metadata.format?.toUpperCase()}, ${metadata.dimensions?.width}x${metadata.dimensions?.height})`;
  }

  private async detectObjects(): Promise<string[]> {
    // 基本実装では空配列を返す（実際の実装ではAI APIを使用）
    return [];
  }

  private async analyzeDominantColors(buffer: Buffer): Promise<string[]> {
    try {
      const { dominant } = await sharp(buffer).stats();
      return [`rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`];
    } catch {
      return [];
    }
  }

  private async extractText(): Promise<string> {
    // OCR機能の基本実装（実際の実装ではTesseract.jsなどを使用）
    return '';
  }

  private async analyzeSentiment(): Promise<'positive' | 'negative' | 'neutral'> {
    // 感情分析の基本実装（実際の実装では感情分析AIを使用）
    return 'neutral';
  }

  private suggestPlacement(metadata: MediaMetadata): ImagePlacement {
    const dimensions = metadata.dimensions;
    if (!dimensions) return ImagePlacements.INLINE;

    const aspectRatio = dimensions.width / dimensions.height;
    
    if (aspectRatio > 1.5 && dimensions.width > 1200) {
      return ImagePlacements.HERO;
    } else if (aspectRatio < 0.8 && dimensions.width < 400) {
      return ImagePlacements.THUMBNAIL;
    } else {
      return ImagePlacements.FIGURE;
    }
  }
}