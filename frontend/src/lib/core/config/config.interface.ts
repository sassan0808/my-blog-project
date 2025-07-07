import { LogLevel } from '../logging/logger.interface';

/**
 * Sanity設定
 */
export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token: string;
  useCdn: boolean;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * 画像アップロード設定
 */
export interface ImageUploadConfig {
  maxFileSize: number;
  allowedFormats: string[];
  optimizationQuality: number;
  autoGenerateAlt: boolean;
  resize: {
    maxWidth: number;
    maxHeight: number;
    maintainAspectRatio: boolean;
  };
  compression: {
    enabled: boolean;
    quality: number;
    progressive: boolean;
  };
}

/**
 * 画像処理設定
 */
export interface ImageProcessingConfig {
  concurrency: number;
  tempDirectory: string;
  cleanupEnabled: boolean;
  cleanupIntervalMs: number;
  processors: {
    sharp: {
      enabled: boolean;
      options: Record<string, any>;
    };
  };
}

/**
 * ロギング設定
 */
export interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  filePath?: string;
  maxFileSize: number;
  maxFiles: number;
  retentionDays: number;
  enableColors: boolean;
  enableTimestamp: boolean;
  enableStackTrace: boolean;
  correlationIdLength: number;
}

/**
 * パフォーマンス設定
 */
export interface PerformanceConfig {
  enableMetrics: boolean;
  metricsInterval: number;
  slowOperationThreshold: number;
  memoryUsageThreshold: number;
}

/**
 * セキュリティ設定
 */
export interface SecurityConfig {
  allowedFileTypes: string[];
  maxRequestsPerMinute: number;
  enableContentValidation: boolean;
  quarantineDirectory: string;
  enableVirusScanning: boolean;
}

/**
 * 開発モード設定
 */
export interface DevelopmentConfig {
  enabled: boolean;
  mockUploads: boolean;
  skipValidation: boolean;
  debugMode: boolean;
  verboseLogging: boolean;
}

/**
 * アプリケーション設定の統合インターフェース
 */
export interface ApplicationConfig {
  sanity: SanityConfig;
  image: ImageUploadConfig;
  processing: ImageProcessingConfig;
  logging: LoggingConfig;
  performance: PerformanceConfig;
  security: SecurityConfig;
  development: DevelopmentConfig;
}

/**
 * 設定の検証結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * 設定の検証エラー
 */
export interface ValidationError {
  field: string;
  message: string;
  value: any;
  constraint: string;
}

/**
 * 設定の検証警告
 */
export interface ValidationWarning {
  field: string;
  message: string;
  value: any;
  recommendation: string;
}

/**
 * 設定プロバイダーのインターフェース
 */
export interface ConfigProvider {
  /**
   * 設定を読み込む
   */
  load(): Promise<ApplicationConfig>;

  /**
   * 設定を保存する
   */
  save(config: ApplicationConfig): Promise<void>;

  /**
   * 設定を検証する
   */
  validate(config: ApplicationConfig): ValidationResult;

  /**
   * 設定の変更を監視する
   */
  watch(callback: (config: ApplicationConfig) => void): void;

  /**
   * 設定の監視を停止する
   */
  unwatch(): void;
}

/**
 * 設定マネージャーのインターフェース
 */
export interface ConfigManager {
  /**
   * 設定を取得する
   */
  getConfig(): ApplicationConfig;

  /**
   * 特定の設定セクションを取得する
   */
  getSanityConfig(): SanityConfig;
  getImageConfig(): ImageUploadConfig;
  getProcessingConfig(): ImageProcessingConfig;
  getLoggingConfig(): LoggingConfig;
  getPerformanceConfig(): PerformanceConfig;
  getSecurityConfig(): SecurityConfig;
  getDevelopmentConfig(): DevelopmentConfig;

  /**
   * 設定を更新する
   */
  updateConfig(config: Partial<ApplicationConfig>): Promise<void>;

  /**
   * 設定をリロードする
   */
  reload(): Promise<void>;

  /**
   * 設定の変更を監視する
   */
  onConfigChange(callback: (config: ApplicationConfig) => void): void;

  /**
   * 設定の監視を停止する
   */
  offConfigChange(callback: (config: ApplicationConfig) => void): void;
}

/**
 * 環境変数のマッピング
 */
export interface EnvironmentVariables {
  // Sanity
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  VITE_SANITY_TOKEN: string;
  VITE_SANITY_USE_CDN: string;
  VITE_SANITY_TIMEOUT: string;
  VITE_SANITY_RETRY_ATTEMPTS: string;
  VITE_SANITY_RETRY_DELAY: string;

  // Image Upload
  IMAGE_MAX_FILE_SIZE: string;
  IMAGE_ALLOWED_FORMATS: string;
  IMAGE_OPTIMIZATION_QUALITY: string;
  IMAGE_AUTO_GENERATE_ALT: string;
  IMAGE_RESIZE_MAX_WIDTH: string;
  IMAGE_RESIZE_MAX_HEIGHT: string;
  IMAGE_COMPRESSION_ENABLED: string;
  IMAGE_COMPRESSION_QUALITY: string;

  // Processing
  PROCESSING_CONCURRENCY: string;
  PROCESSING_TEMP_DIRECTORY: string;
  PROCESSING_CLEANUP_ENABLED: string;
  PROCESSING_CLEANUP_INTERVAL: string;

  // Logging
  LOG_LEVEL: string;
  LOG_ENABLE_CONSOLE: string;
  LOG_ENABLE_FILE: string;
  LOG_FILE_PATH: string;
  LOG_MAX_FILE_SIZE: string;
  LOG_MAX_FILES: string;
  LOG_RETENTION_DAYS: string;
  LOG_ENABLE_COLORS: string;
  LOG_ENABLE_TIMESTAMP: string;
  LOG_ENABLE_STACK_TRACE: string;
  LOG_CORRELATION_ID_LENGTH: string;

  // Performance
  PERFORMANCE_ENABLE_METRICS: string;
  PERFORMANCE_METRICS_INTERVAL: string;
  PERFORMANCE_SLOW_OPERATION_THRESHOLD: string;
  PERFORMANCE_MEMORY_USAGE_THRESHOLD: string;

  // Security
  SECURITY_ALLOWED_FILE_TYPES: string;
  SECURITY_MAX_REQUESTS_PER_MINUTE: string;
  SECURITY_ENABLE_CONTENT_VALIDATION: string;
  SECURITY_QUARANTINE_DIRECTORY: string;
  SECURITY_ENABLE_VIRUS_SCANNING: string;

  // Development
  DEVELOPMENT_ENABLED: string;
  DEVELOPMENT_MOCK_UPLOADS: string;
  DEVELOPMENT_SKIP_VALIDATION: string;
  DEVELOPMENT_DEBUG_MODE: string;
  DEVELOPMENT_VERBOSE_LOGGING: string;
}