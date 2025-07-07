import { SanityConfig } from '../../core/config/config.interface';
import { Image } from '../../domain/entities/image';
import { Article } from '../../domain/entities/article';
import { UploadedMedia } from '../../domain/entities/media.interface';

/**
 * Sanity アセットの情報
 */
export interface SanityAsset {
  _id: string;
  _type: 'sanity.imageAsset';
  url: string;
  originalFilename: string;
  size: number;
  mimeType: string;
  metadata: {
    dimensions: {
      width: number;
      height: number;
      aspectRatio: number;
    };
    hasAlpha: boolean;
    isOpaque: boolean;
  };
  uploadId: string;
  path: string;
  sha1hash: string;
}

/**
 * Sanity ドキュメントの基本構造
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Sanity 記事ドキュメント
 */
export interface SanityPost extends SanityDocument {
  _type: 'post';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  excerpt?: string;
  body: any[]; // PortableText
  status: 'draft' | 'published' | 'archived';
  categories: Array<{
    _type: 'reference';
    _ref: string;
  }>;
  tags: string[];
  mainImage?: {
    _type: 'image';
    asset: {
      _type: 'reference';
      _ref: string;
    };
    alt: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  publishedAt?: string;
  author: {
    _type: 'reference';
    _ref: string;
  };
}

/**
 * アップロードオプション
 */
export interface UploadOptions {
  filename?: string;
  title?: string;
  description?: string;
  creditLine?: string;
  source?: {
    name: string;
    url?: string;
    id?: string;
  };
}

/**
 * 記事作成オプション
 */
export interface ArticleCreateOptions {
  publish?: boolean;
  validateReferences?: boolean;
  returnDocuments?: boolean;
}

/**
 * 記事更新オプション
 */
export interface ArticleUpdateOptions {
  ifRevisionID?: string;
  returnDocuments?: boolean;
}

/**
 * クエリオプション
 */
export interface QueryOptions {
  useCdn?: boolean;
  perspective?: 'published' | 'previewDrafts';
  stega?: boolean;
}

/**
 * トランザクション結果
 */
export interface TransactionResult {
  transactionId: string;
  results: Array<{
    id: string;
    operation: 'create' | 'createOrReplace' | 'createIfNotExists' | 'delete' | 'patch';
    document?: SanityDocument;
  }>;
}

/**
 * バッチ操作の結果
 */
export interface BatchResult {
  success: boolean;
  results: Array<{
    id: string;
    success: boolean;
    result?: any;
    error?: Error;
  }>;
  errors: Error[];
}

/**
 * Sanity クライアントのメインインターフェース
 */
export interface SanityClientInterface {
  /**
   * 設定を取得
   */
  getConfig(): SanityConfig;

  /**
   * 接続をテスト
   */
  testConnection(): Promise<boolean>;

  /**
   * アセット（画像）のアップロード
   */
  uploadAsset(
    buffer: Buffer, 
    options?: UploadOptions
  ): Promise<SanityAsset>;

  /**
   * 複数アセットの一括アップロード
   */
  uploadAssetsBatch(
    assets: Array<{
      buffer: Buffer;
      options?: UploadOptions;
    }>
  ): Promise<BatchResult>;

  /**
   * アセットの削除
   */
  deleteAsset(assetId: string): Promise<void>;

  /**
   * アセット情報の取得
   */
  getAsset(assetId: string): Promise<SanityAsset | null>;

  /**
   * 記事の作成
   */
  createArticle(
    article: Article, 
    options?: ArticleCreateOptions
  ): Promise<SanityPost>;

  /**
   * 記事の更新
   */
  updateArticle(
    articleId: string,
    updates: Partial<Article>,
    options?: ArticleUpdateOptions
  ): Promise<SanityPost>;

  /**
   * 記事の削除
   */
  deleteArticle(articleId: string): Promise<void>;

  /**
   * 記事の取得
   */
  getArticle(articleId: string, options?: QueryOptions): Promise<SanityPost | null>;

  /**
   * 記事一覧の取得
   */
  getArticles(options?: {
    limit?: number;
    offset?: number;
    filter?: string;
    order?: string;
  } & QueryOptions): Promise<SanityPost[]>;

  /**
   * スラッグによる記事取得
   */
  getArticleBySlug(slug: string, options?: QueryOptions): Promise<SanityPost | null>;

  /**
   * カテゴリ一覧の取得
   */
  getCategories(): Promise<Array<{
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
  }>>;

  /**
   * 著者情報の取得
   */
  getAuthors(): Promise<Array<{
    _id: string;
    name: string;
    slug: { current: string };
    bio?: string;
    image?: SanityAsset;
  }>>;

  /**
   * カスタムクエリの実行
   */
  query<T = any>(
    query: string, 
    params?: Record<string, any>,
    options?: QueryOptions
  ): Promise<T>;

  /**
   * 複数のドキュメントの一括操作
   */
  mutate(
    mutations: Array<{
      create?: any;
      createOrReplace?: any;
      createIfNotExists?: any;
      delete?: { id: string };
      patch?: {
        id: string;
        set?: Record<string, any>;
        unset?: string[];
        setIfMissing?: Record<string, any>;
        inc?: Record<string, number>;
        dec?: Record<string, number>;
      };
    }>
  ): Promise<TransactionResult>;

  /**
   * リスナーの登録（リアルタイム更新）
   */
  listen(
    query: string,
    params?: Record<string, any>,
    options?: {
      includeResult?: boolean;
      visibility?: 'query' | 'transaction';
    }
  ): {
    subscribe: (callback: (update: any) => void) => void;
    unsubscribe: () => void;
  };

  /**
   * プロジェクト情報の取得
   */
  getProjectInfo(): Promise<{
    id: string;
    displayName: string;
    studioHost?: string;
    members: Array<{
      id: string;
      role: string;
    }>;
  }>;

  /**
   * データセット情報の取得
   */
  getDatasets(): Promise<Array<{
    name: string;
    title?: string;
    aclMode: 'public' | 'private';
  }>>;
}

/**
 * 画像専用のアップローダーインターフェース
 */
export interface ImageUploader {
  /**
   * 単一画像のアップロード
   */
  uploadImage(image: Image): Promise<UploadedMedia>;

  /**
   * 複数画像の並列アップロード
   */
  uploadImages(images: Image[]): Promise<UploadedMedia[]>;

  /**
   * 画像の置換
   */
  replaceImage(oldAssetId: string, newImage: Image): Promise<UploadedMedia>;

  /**
   * 画像の削除
   */
  deleteImage(assetId: string): Promise<void>;

  /**
   * アップロード進捗の監視
   */
  onProgress(callback: (progress: UploadProgress) => void): void;

  /**
   * アップロード設定の変更
   */
  setUploadOptions(options: Partial<UploadOptions>): void;
}

/**
 * アップロード進捗の情報
 */
export interface UploadProgress {
  fileIndex: number;
  totalFiles: number;
  fileName: string;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  stage: 'preparing' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: Error;
}

/**
 * 記事パブリッシャーのインターフェース
 */
export interface ArticlePublisher {
  /**
   * 記事の作成と公開
   */
  createAndPublish(article: Article): Promise<SanityPost>;

  /**
   * ドラフトの作成
   */
  createDraft(article: Article): Promise<SanityPost>;

  /**
   * ドラフトの公開
   */
  publishDraft(articleId: string): Promise<SanityPost>;

  /**
   * 記事の非公開化
   */
  unpublish(articleId: string): Promise<SanityPost>;

  /**
   * 記事とアセットの一括作成
   */
  createArticleWithAssets(
    article: Article,
    images: Image[]
  ): Promise<{
    article: SanityPost;
    uploadedImages: UploadedMedia[];
  }>;

  /**
   * 記事の検証
   */
  validateArticle(article: Article): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>;
}

/**
 * キャッシュインターフェース
 */
export interface SanityCache {
  /**
   * クエリ結果をキャッシュ
   */
  set(key: string, data: any, ttl?: number): Promise<void>;

  /**
   * キャッシュからデータを取得
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * キャッシュを削除
   */
  delete(key: string): Promise<void>;

  /**
   * キャッシュをクリア
   */
  clear(): Promise<void>;

  /**
   * キャッシュキーを生成
   */
  generateKey(query: string, params?: Record<string, any>): string;
}