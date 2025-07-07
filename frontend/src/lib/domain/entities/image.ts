import { 
  Media, 
  MediaType, 
  MediaMetadata, 
  ImageFormat, 
  ProcessedMedia, 
  UploadedMedia,
  ImageAnalysis,
  ImagePlacement,
  OptimizationOptions
} from './media.interface';

/**
 * 画像エンティティ
 */
export class Image implements Media {
  public readonly id: string;
  public readonly type = MediaType.IMAGE;
  public readonly fileName: string;
  public readonly fileSize: number;
  public readonly mimeType: string;
  public readonly metadata: MediaMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public url?: string;
  public buffer?: Buffer;
  public altText?: string;
  public caption?: string;
  public credits?: string;
  public analysis?: ImageAnalysis;

  constructor(params: {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    metadata: MediaMetadata;
    buffer?: Buffer;
    url?: string;
    altText?: string;
    caption?: string;
    credits?: string;
    analysis?: ImageAnalysis;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.fileName = params.fileName;
    this.fileSize = params.fileSize;
    this.mimeType = params.mimeType;
    this.metadata = params.metadata;
    this.buffer = params.buffer;
    this.url = params.url;
    this.altText = params.altText;
    this.caption = params.caption;
    this.credits = params.credits;
    this.analysis = params.analysis;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  /**
   * ファイルパスから画像インスタンスを作成
   */
  static async fromFile(filePath: string, buffer: Buffer): Promise<Image> {
    const fileName = filePath.split('/').pop() || 'unknown';
    const fileSize = buffer.length;
    
    // MIME タイプの判定（簡易版）
    const mimeType = Image.getMimeTypeFromBuffer(buffer);
    
    // メタデータの抽出
    const metadata = await Image.extractMetadata(buffer, fileName);
    
    return new Image({
      id: Image.generateId(),
      fileName,
      fileSize,
      mimeType,
      metadata,
      buffer
    });
  }

  /**
   * アップロード済み画像から画像インスタンスを作成
   */
  static fromUploadedMedia(uploaded: UploadedMedia): Image {
    return new Image({
      id: uploaded.id,
      fileName: uploaded.fileName,
      fileSize: uploaded.fileSize,
      mimeType: uploaded.mimeType,
      metadata: uploaded.metadata,
      url: uploaded.url,
      altText: uploaded.altText,
      caption: uploaded.caption,
      credits: uploaded.credits,
      createdAt: uploaded.uploadedAt,
      updatedAt: uploaded.uploadedAt
    });
  }

  /**
   * 画像フォーマットを取得
   */
  getFormat(): ImageFormat {
    switch (this.mimeType) {
      case 'image/jpeg':
        return ImageFormat.JPEG;
      case 'image/png':
        return ImageFormat.PNG;
      case 'image/webp':
        return ImageFormat.WEBP;
      case 'image/gif':
        return ImageFormat.GIF;
      case 'image/svg+xml':
        return ImageFormat.SVG;
      default:
        throw new Error(`Unsupported image format: ${this.mimeType}`);
    }
  }

  /**
   * 画像サイズを取得
   */
  getDimensions(): { width: number; height: number } | null {
    return this.metadata.dimensions || null;
  }

  /**
   * アスペクト比を取得
   */
  getAspectRatio(): number | null {
    const dimensions = this.getDimensions();
    if (!dimensions) return null;
    return dimensions.width / dimensions.height;
  }

  /**
   * 画像が横長かどうか
   */
  isLandscape(): boolean {
    const aspectRatio = this.getAspectRatio();
    return aspectRatio ? aspectRatio > 1 : false;
  }

  /**
   * 画像が縦長かどうか
   */
  isPortrait(): boolean {
    const aspectRatio = this.getAspectRatio();
    return aspectRatio ? aspectRatio < 1 : false;
  }

  /**
   * 画像が正方形かどうか
   */
  isSquare(): boolean {
    const aspectRatio = this.getAspectRatio();
    return aspectRatio ? Math.abs(aspectRatio - 1) < 0.1 : false;
  }

  /**
   * 透明度を持つかどうか
   */
  hasTransparency(): boolean {
    return this.metadata.hasAlpha || this.getFormat() === ImageFormat.PNG;
  }

  /**
   * アニメーションGIFかどうか
   */
  isAnimated(): boolean {
    return this.getFormat() === ImageFormat.GIF && this.metadata.format === 'gif';
  }

  /**
   * ファイルサイズを人間が読みやすい形式で取得
   */
  getReadableFileSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }

  /**
   * 最適化が推奨されるかどうか
   */
  shouldOptimize(): boolean {
    // 10MB以上は最適化推奨
    if (this.fileSize > 10 * 1024 * 1024) return true;
    
    // 大きな解像度は最適化推奨
    const dimensions = this.getDimensions();
    if (dimensions && (dimensions.width > 2048 || dimensions.height > 2048)) return true;
    
    // PNG で透明度を使用していない場合はJPEGへの変換推奨
    if (this.getFormat() === ImageFormat.PNG && !this.hasTransparency()) return true;
    
    return false;
  }

  /**
   * 推奨される配置を取得
   */
  getSuggestedPlacement(): ImagePlacement {
    if (this.analysis?.suggestedPlacement) {
      return this.analysis.suggestedPlacement;
    }

    const dimensions = this.getDimensions();
    if (!dimensions) return ImagePlacement.INLINE;

    // アスペクト比に基づく推奨
    if (this.isLandscape() && dimensions.width > 1200) {
      return ImagePlacement.HERO;
    }
    
    if (this.isSquare() && dimensions.width < 400) {
      return ImagePlacement.THUMBNAIL;
    }
    
    return ImagePlacement.FIGURE;
  }

  /**
   * altテキストを取得（自動生成または手動設定）
   */
  getAltText(): string {
    if (this.altText) return this.altText;
    if (this.analysis?.suggestedAltText) return this.analysis.suggestedAltText;
    return `Image: ${this.fileName}`;
  }

  /**
   * 画像情報を JSON 形式で出力
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      fileName: this.fileName,
      fileSize: this.fileSize,
      readableFileSize: this.getReadableFileSize(),
      mimeType: this.mimeType,
      format: this.getFormat(),
      metadata: this.metadata,
      url: this.url,
      altText: this.getAltText(),
      caption: this.caption,
      credits: this.credits,
      analysis: this.analysis,
      suggestedPlacement: this.getSuggestedPlacement(),
      shouldOptimize: this.shouldOptimize(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * 一意なIDを生成
   */
  private static generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * バッファからMIMEタイプを判定
   */
  private static getMimeTypeFromBuffer(buffer: Buffer): string {
    // マジックナンバーによる判定
    if (buffer.length < 4) return 'application/octet-stream';

    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      return 'image/jpeg';
    }

    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    }

    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return 'image/gif';
    }

    // WebP
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }

    return 'application/octet-stream';
  }

  /**
   * バッファからメタデータを抽出（基本版）
   */
  private static async extractMetadata(buffer: Buffer, fileName: string): Promise<MediaMetadata> {
    const mimeType = Image.getMimeTypeFromBuffer(buffer);
    
    // 基本的なメタデータ
    const metadata: MediaMetadata = {
      fileName,
      fileSize: buffer.length,
      mimeType,
      format: mimeType.split('/')[1],
      created: new Date(),
      modified: new Date()
    };

    // 簡易的な画像サイズ抽出（実際の実装では sharp などを使用）
    try {
      if (mimeType === 'image/png') {
        // PNG の場合、IHDR チャンクから取得
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        metadata.dimensions = { width, height };
      } else if (mimeType === 'image/jpeg') {
        // JPEG の場合、SOF セグメントから取得（簡易版）
        // 実際の実装では適切なJPEGパーサーを使用
        metadata.dimensions = { width: 0, height: 0 }; // プレースホルダー
      }
    } catch (error) {
      // エラーが発生した場合は無視
    }

    return metadata;
  }
}

/**
 * 処理済み画像クラス
 */
export class ProcessedImage extends Image {
  public readonly originalImage: Image;
  public readonly optimizationApplied: OptimizationOptions;
  public readonly processingTime: number;
  public readonly sizeDifference: {
    original: number;
    processed: number;
    compressionRatio: number;
  };

  constructor(
    originalImage: Image,
    processedData: {
      buffer: Buffer;
      metadata: MediaMetadata;
      optimizationApplied: OptimizationOptions;
      processingTime: number;
    }
  ) {
    super({
      id: originalImage.id + '_processed',
      fileName: originalImage.fileName,
      fileSize: processedData.buffer.length,
      mimeType: originalImage.mimeType,
      metadata: processedData.metadata,
      buffer: processedData.buffer,
      altText: originalImage.altText,
      caption: originalImage.caption,
      credits: originalImage.credits,
      analysis: originalImage.analysis
    });

    this.originalImage = originalImage;
    this.optimizationApplied = processedData.optimizationApplied;
    this.processingTime = processedData.processingTime;
    this.sizeDifference = {
      original: originalImage.fileSize,
      processed: this.fileSize,
      compressionRatio: Math.round((1 - this.fileSize / originalImage.fileSize) * 100)
    };
  }

  /**
   * 最適化効果を取得
   */
  getOptimizationEffect(): string {
    const ratio = this.sizeDifference.compressionRatio;
    if (ratio > 50) return 'excellent';
    if (ratio > 30) return 'good';
    if (ratio > 10) return 'moderate';
    return 'minimal';
  }

  /**
   * 処理統計を取得
   */
  getProcessingStats(): Record<string, any> {
    return {
      processingTime: this.processingTime,
      sizeDifference: this.sizeDifference,
      optimizationEffect: this.getOptimizationEffect(),
      optimizationApplied: this.optimizationApplied
    };
  }
}