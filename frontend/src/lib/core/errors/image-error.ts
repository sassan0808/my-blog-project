import { BaseError } from './base-error';

/**
 * 画像バリデーションエラーの詳細情報
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * 画像バリデーションエラー
 */
export class ImageValidationError extends BaseError {
  public readonly validationErrors: ValidationError[];

  constructor(message: string, validationErrors: ValidationError[]) {
    super(message, 'IMAGE_VALIDATION_ERROR', 400, true, {
      validationErrors
    });
    
    this.validationErrors = validationErrors;
  }

  getUserMessage(): string {
    const errors = this.validationErrors.map(e => e.message).join(', ');
    return `画像の検証に失敗しました: ${errors}`;
  }
}

/**
 * 画像アップロードエラー
 */
export class ImageUploadError extends BaseError {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message, 'IMAGE_UPLOAD_ERROR', 500, true, {
      causeMessage: cause?.message,
      causeStack: cause?.stack
    });
    
    this.cause = cause;
  }

  getUserMessage(): string {
    return '画像のアップロードに失敗しました。しばらく時間をおいてから再度お試しください。';
  }
}

/**
 * 画像処理エラー
 */
export class ImageProcessingError extends BaseError {
  public readonly processingStage: string;

  constructor(message: string, processingStage: string, cause?: Error) {
    super(message, 'IMAGE_PROCESSING_ERROR', 500, true, {
      processingStage,
      causeMessage: cause?.message,
      causeStack: cause?.stack
    });
    
    this.processingStage = processingStage;
  }

  getUserMessage(): string {
    return `画像の処理に失敗しました（${this.processingStage}）。画像ファイルが破損していないか確認してください。`;
  }
}

/**
 * 画像フォーマットエラー
 */
export class ImageFormatError extends BaseError {
  public readonly currentFormat: string;
  public readonly allowedFormats: string[];

  constructor(currentFormat: string, allowedFormats: string[]) {
    const message = `サポートされていない画像フォーマットです: ${currentFormat}`;
    super(message, 'IMAGE_FORMAT_ERROR', 400, true, {
      currentFormat,
      allowedFormats
    });
    
    this.currentFormat = currentFormat;
    this.allowedFormats = allowedFormats;
  }

  getUserMessage(): string {
    return `画像フォーマット「${this.currentFormat}」はサポートされていません。サポートされているフォーマット: ${this.allowedFormats.join(', ')}`;
  }
}

/**
 * 画像サイズエラー
 */
export class ImageSizeError extends BaseError {
  public readonly currentSize: number;
  public readonly maxSize: number;

  constructor(currentSize: number, maxSize: number) {
    const message = `画像ファイルサイズが上限を超えています: ${currentSize} bytes (max: ${maxSize} bytes)`;
    super(message, 'IMAGE_SIZE_ERROR', 400, true, {
      currentSize,
      maxSize,
      currentSizeMB: Math.round(currentSize / (1024 * 1024) * 100) / 100,
      maxSizeMB: Math.round(maxSize / (1024 * 1024) * 100) / 100
    });
    
    this.currentSize = currentSize;
    this.maxSize = maxSize;
  }

  getUserMessage(): string {
    const currentMB = Math.round(this.currentSize / (1024 * 1024) * 100) / 100;
    const maxMB = Math.round(this.maxSize / (1024 * 1024) * 100) / 100;
    return `画像ファイルサイズが上限を超えています（${currentMB}MB > ${maxMB}MB）。より小さなファイルを選択してください。`;
  }
}

/**
 * 画像解析エラー
 */
export class ImageAnalysisError extends BaseError {
  public readonly analysisType: string;

  constructor(message: string, analysisType: string, cause?: Error) {
    super(message, 'IMAGE_ANALYSIS_ERROR', 500, true, {
      analysisType,
      causeMessage: cause?.message
    });
    
    this.analysisType = analysisType;
  }

  getUserMessage(): string {
    return `画像の解析に失敗しました（${this.analysisType}）。`;
  }
}