import { BaseError } from './base-error';

/**
 * Sanity認証エラー
 */
export class SanityAuthenticationError extends BaseError {
  constructor(message: string) {
    super(message, 'SANITY_AUTH_ERROR', 401, true);
  }

  getUserMessage(): string {
    return 'Sanityの認証に失敗しました。API トークンが正しく設定されているか確認してください。';
  }
}

/**
 * Sanity接続エラー
 */
export class SanityConnectionError extends BaseError {
  public readonly endpoint: string;

  constructor(message: string, endpoint: string, cause?: Error) {
    super(message, 'SANITY_CONNECTION_ERROR', 503, true, {
      endpoint,
      causeMessage: cause?.message
    });
    
    this.endpoint = endpoint;
  }

  getUserMessage(): string {
    return 'Sanityサーバーに接続できませんでした。インターネット接続を確認してください。';
  }
}

/**
 * Sanity設定エラー
 */
export class SanityConfigurationError extends BaseError {
  public readonly configField: string;

  constructor(message: string, configField: string) {
    super(message, 'SANITY_CONFIG_ERROR', 500, false, {
      configField
    });
    
    this.configField = configField;
  }

  getUserMessage(): string {
    return `Sanityの設定に問題があります: ${this.configField}`;
  }
}

/**
 * Sanity APIエラー
 */
export class SanityApiError extends BaseError {
  public readonly apiMethod: string;
  public readonly responseStatus?: number;
  public readonly responseBody?: any;

  constructor(
    message: string,
    apiMethod: string,
    responseStatus?: number,
    responseBody?: any
  ) {
    super(message, 'SANITY_API_ERROR', responseStatus || 500, true, {
      apiMethod,
      responseStatus,
      responseBody
    });
    
    this.apiMethod = apiMethod;
    this.responseStatus = responseStatus;
    this.responseBody = responseBody;
  }

  getUserMessage(): string {
    if (this.responseStatus === 429) {
      return 'Sanity APIのリクエスト制限に達しました。しばらく時間をおいてから再度お試しください。';
    }
    
    if (this.responseStatus === 404) {
      return '指定されたリソースが見つかりませんでした。';
    }
    
    return `Sanity APIでエラーが発生しました（${this.apiMethod}）。`;
  }
}

/**
 * Sanityアセットアップロードエラー
 */
export class SanityAssetUploadError extends BaseError {
  public readonly assetType: string;
  public readonly fileName?: string;

  constructor(message: string, assetType: string, fileName?: string, cause?: Error) {
    super(message, 'SANITY_ASSET_UPLOAD_ERROR', 500, true, {
      assetType,
      fileName,
      causeMessage: cause?.message
    });
    
    this.assetType = assetType;
    this.fileName = fileName;
  }

  getUserMessage(): string {
    const fileInfo = this.fileName ? `（${this.fileName}）` : '';
    return `Sanityへの${this.assetType}アップロードに失敗しました${fileInfo}。`;
  }
}

/**
 * Sanityドキュメント操作エラー
 */
export class SanityDocumentError extends BaseError {
  public readonly operation: string;
  public readonly documentType: string;
  public readonly documentId?: string;

  constructor(
    message: string,
    operation: string,
    documentType: string,
    documentId?: string,
    cause?: Error
  ) {
    super(message, 'SANITY_DOCUMENT_ERROR', 500, true, {
      operation,
      documentType,
      documentId,
      causeMessage: cause?.message
    });
    
    this.operation = operation;
    this.documentType = documentType;
    this.documentId = documentId;
  }

  getUserMessage(): string {
    return `Sanityドキュメントの${this.operation}に失敗しました（${this.documentType}）。`;
  }
}

/**
 * Sanityクエリエラー
 */
export class SanityQueryError extends BaseError {
  public readonly query: string;

  constructor(message: string, query: string, cause?: Error) {
    super(message, 'SANITY_QUERY_ERROR', 500, true, {
      query,
      causeMessage: cause?.message
    });
    
    this.query = query;
  }

  getUserMessage(): string {
    return 'Sanityクエリの実行に失敗しました。';
  }
}