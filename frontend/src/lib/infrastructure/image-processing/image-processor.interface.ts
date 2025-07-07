import { 
  MediaMetadata, 
  MediaValidationResult, 
  MediaProcessingResult,
  OptimizationOptions,
  ImageAnalysis
} from '../../domain/entities/media.interface';
import { Image, ProcessedImage } from '../../domain/entities/image';

/**
 * 画像処理の設定
 */
export interface ImageProcessingOptions {
  optimization?: OptimizationOptions;
  validation?: ValidationOptions;
  analysis?: AnalysisOptions;
}

/**
 * バリデーション設定
 */
export interface ValidationOptions {
  maxFileSize: number;
  allowedFormats: string[];
  maxDimensions?: {
    width: number;
    height: number;
  };
  minDimensions?: {
    width: number;
    height: number;
  };
  checkContent?: boolean;
  allowAnimated?: boolean;
}

/**
 * 画像解析設定
 */
export interface AnalysisOptions {
  generateAltText: boolean;
  detectObjects: boolean;
  analyzeColors: boolean;
  extractText: boolean;
  analyzeSentiment: boolean;
  suggestPlacement: boolean;
}

/**
 * 画像変換オプション
 */
export interface ConversionOptions {
  format?: 'jpeg' | 'png' | 'webp' | 'gif';
  quality?: number;
  progressive?: boolean;
  compressionLevel?: number;
}

/**
 * リサイズオプション
 */
export interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  background?: string;
  withoutEnlargement?: boolean;
}

/**
 * 透かしオプション
 */
export interface WatermarkOptions {
  image?: Buffer;
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  size?: number;
}

/**
 * 画像処理のメインインターフェース
 */
export interface ImageProcessor {
  /**
   * 画像ファイルの基本情報を取得
   */
  getMetadata(buffer: Buffer): Promise<MediaMetadata>;

  /**
   * 画像ファイルをバリデーション
   */
  validate(buffer: Buffer, options: ValidationOptions): Promise<MediaValidationResult>;

  /**
   * 画像を最適化処理
   */
  optimize(image: Image, options: OptimizationOptions): Promise<ProcessedImage>;

  /**
   * 画像をリサイズ
   */
  resize(buffer: Buffer, options: ResizeOptions): Promise<Buffer>;

  /**
   * 画像フォーマットを変換
   */
  convert(buffer: Buffer, options: ConversionOptions): Promise<Buffer>;

  /**
   * 画像を圧縮
   */
  compress(buffer: Buffer, quality: number): Promise<Buffer>;

  /**
   * 画像に透かしを追加
   */
  addWatermark(buffer: Buffer, options: WatermarkOptions): Promise<Buffer>;

  /**
   * 画像の内容を解析
   */
  analyze(buffer: Buffer, options: AnalysisOptions): Promise<ImageAnalysis>;

  /**
   * サムネイルを生成
   */
  generateThumbnail(buffer: Buffer, size: number): Promise<Buffer>;

  /**
   * 複数のバリエーションを生成
   */
  generateVariations(buffer: Buffer, variations: Array<{
    name: string;
    options: ResizeOptions & ConversionOptions;
  }>): Promise<Array<{
    name: string;
    buffer: Buffer;
    metadata: MediaMetadata;
  }>>;

  /**
   * 処理をバッチで実行
   */
  processBatch(images: Array<{
    image: Image;
    options: ImageProcessingOptions;
  }>): Promise<MediaProcessingResult[]>;
}

/**
 * 画像解析サービスのインターフェース
 */
export interface ImageAnalyzer {
  /**
   * 画像からテキストを抽出（OCR）
   */
  extractText(buffer: Buffer): Promise<string>;

  /**
   * 物体検出
   */
  detectObjects(buffer: Buffer): Promise<Array<{
    name: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>>;

  /**
   * 顔検出
   */
  detectFaces(buffer: Buffer): Promise<Array<{
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    emotions?: Record<string, number>;
  }>>;

  /**
   * 色分析
   */
  analyzeColors(buffer: Buffer): Promise<{
    dominantColors: Array<{
      color: string;
      percentage: number;
    }>;
    palette: string[];
    brightness: number;
    contrast: number;
  }>;

  /**
   * 画像の内容に基づくalt textの生成
   */
  generateAltText(buffer: Buffer): Promise<string>;

  /**
   * 画像の感情分析
   */
  analyzeSentiment(buffer: Buffer): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: Record<string, number>;
  }>;

  /**
   * 画像の品質評価
   */
  assessQuality(buffer: Buffer): Promise<{
    sharpness: number;
    noise: number;
    exposure: number;
    composition: number;
    overall: number;
  }>;

  /**
   * 類似画像の検出
   */
  findSimilarImages(buffer: Buffer, candidates: Buffer[]): Promise<Array<{
    index: number;
    similarity: number;
  }>>;
}

/**
 * 画像の最適化戦略
 */
export interface OptimizationStrategy {
  /**
   * 画像に最適な最適化設定を決定
   */
  determineOptimization(image: Image): Promise<OptimizationOptions>;

  /**
   * ファイルサイズの削減目標を設定
   */
  setCompressionTarget(targetSizeKB: number): void;

  /**
   * 品質と圧縮のバランスを調整
   */
  balanceQualityAndSize(originalSize: number, targetSize: number): OptimizationOptions;
}

/**
 * 画像処理パイプライン
 */
export interface ImageProcessingPipeline {
  /**
   * 処理ステップを追加
   */
  addStep(step: ProcessingStep): void;

  /**
   * 処理を実行
   */
  execute(image: Image): Promise<ProcessedImage>;

  /**
   * 並列処理でバッチ実行
   */
  executeBatch(images: Image[], concurrency?: number): Promise<ProcessedImage[]>;

  /**
   * 処理進捗のコールバックを設定
   */
  onProgress(callback: (progress: ProcessingProgress) => void): void;
}

/**
 * 処理ステップのインターフェース
 */
export interface ProcessingStep {
  name: string;
  execute(buffer: Buffer, metadata: MediaMetadata): Promise<{
    buffer: Buffer;
    metadata: MediaMetadata;
  }>;
  isRequired: boolean;
  estimatedTime: number; // ms
}

/**
 * 処理進捗の情報
 */
export interface ProcessingProgress {
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
  imageIndex: number;
  totalImages: number;
  elapsedTime: number;
  estimatedRemainingTime: number;
  currentImageProgress: number; // 0-100
  overallProgress: number; // 0-100
}

/**
 * 画像キャッシュのインターフェース
 */
export interface ImageCache {
  /**
   * 処理済み画像をキャッシュに保存
   */
  put(key: string, image: ProcessedImage, ttl?: number): Promise<void>;

  /**
   * キャッシュから処理済み画像を取得
   */
  get(key: string): Promise<ProcessedImage | null>;

  /**
   * キャッシュキーを生成
   */
  generateKey(image: Image, options: ImageProcessingOptions): string;

  /**
   * キャッシュをクリア
   */
  clear(): Promise<void>;

  /**
   * 期限切れのアイテムを削除
   */
  cleanup(): Promise<void>;

  /**
   * キャッシュ統計を取得
   */
  getStats(): Promise<{
    hitRate: number;
    totalSize: number;
    itemCount: number;
  }>;
}

/**
 * 画像処理の設定プロバイダー
 */
export interface ImageProcessingConfigProvider {
  /**
   * デフォルトの最適化設定を取得
   */
  getDefaultOptimization(): OptimizationOptions;

  /**
   * ファイルタイプ別の設定を取得
   */
  getFormatSpecificSettings(format: string): ImageProcessingOptions;

  /**
   * サイズ別の設定を取得
   */
  getSizeBasedSettings(fileSize: number): ImageProcessingOptions;

  /**
   * 用途別の設定を取得
   */
  getUseCaseSettings(useCase: 'thumbnail' | 'hero' | 'gallery' | 'social'): ImageProcessingOptions;
}