/**
 * メディアタイプ
 */
export const MediaTypes = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document'
} as const;

export type MediaType = typeof MediaTypes[keyof typeof MediaTypes];

/**
 * メディアフォーマット
 */
export const ImageFormats = {
  JPEG: 'jpeg',
  PNG: 'png',
  WEBP: 'webp',
  GIF: 'gif',
  SVG: 'svg'
} as const;

export type ImageFormat = typeof ImageFormats[keyof typeof ImageFormats];

/**
 * 画像の最適化設定
 */
export interface OptimizationOptions {
  quality: number;
  progressive: boolean;
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
  };
  format?: ImageFormat;
}

/**
 * メディアファイルのメタデータ
 */
export interface MediaMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  format: string;
  dimensions?: {
    width: number;
    height: number;
  };
  colorSpace?: string;
  hasAlpha?: boolean;
  density?: number;
  created?: Date;
  modified?: Date;
  checksum?: string;
}

/**
 * 処理済みメディアの情報
 */
export interface ProcessedMedia {
  originalBuffer: Buffer;
  processedBuffer: Buffer;
  metadata: MediaMetadata;
  optimizationApplied: boolean;
  sizeDifference: {
    original: number;
    processed: number;
    compressionRatio: number;
  };
  processingTime: number;
}

/**
 * アップロード済みメディアの情報
 */
export interface UploadedMedia {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  metadata: MediaMetadata;
  altText?: string;
  caption?: string;
  credits?: string;
  uploadedAt: Date;
  sanityAssetId: string;
  sanityDocumentId?: string;
}

/**
 * 基底メディアインターフェース
 */
export interface Media {
  id: string;
  type: MediaType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
  metadata: MediaMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * メディア処理の結果
 */
export interface MediaProcessingResult {
  success: boolean;
  media?: ProcessedMedia;
  error?: Error;
  warnings: string[];
  processingSteps: string[];
  performance: {
    totalTime: number;
    validationTime: number;
    processingTime: number;
    optimizationTime: number;
  };
}

/**
 * メディア検証の結果
 */
export interface MediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: MediaMetadata;
}

/**
 * 画像参照の情報
 */
export interface ImageReference {
  filePath: string;
  altText?: string;
  caption?: string;
  placement?: ImagePlacement;
  processingOptions?: OptimizationOptions;
}

/**
 * 画像の配置方法
 */
export const ImagePlacements = {
  INLINE: 'inline',
  FIGURE: 'figure',
  HERO: 'hero',
  THUMBNAIL: 'thumbnail',
  BACKGROUND: 'background'
} as const;

export type ImagePlacement = typeof ImagePlacements[keyof typeof ImagePlacements];

/**
 * 画像の配置戦略
 */
export interface ImagePlacementStrategy {
  type: 'manual' | 'auto' | 'smart';
  rules?: ImagePlacementRule[];
}

/**
 * 画像配置のルール
 */
export interface ImagePlacementRule {
  condition: string;
  placement: ImagePlacement;
  priority: number;
}

/**
 * 分析された画像の内容
 */
export interface ImageAnalysis {
  description: string;
  suggestedAltText: string;
  detectedObjects: string[];
  dominantColors: string[];
  textContent?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  appropriateForContent: boolean;
  suggestedPlacement: ImagePlacement;
  confidence: number;
}