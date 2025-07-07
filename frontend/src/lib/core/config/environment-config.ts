import { 
  ApplicationConfig, 
  ConfigProvider, 
  ConfigManager, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  EnvironmentVariables 
} from './config.interface';
import { LogLevel } from '../logging/logger.interface';

/**
 * デフォルト設定値
 */
const DEFAULT_CONFIG: ApplicationConfig = {
  sanity: {
    projectId: 'qcfwoevq',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: '',
    useCdn: false,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  image: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    optimizationQuality: 85,
    autoGenerateAlt: true,
    resize: {
      maxWidth: 1920,
      maxHeight: 1080,
      maintainAspectRatio: true
    },
    compression: {
      enabled: true,
      quality: 85,
      progressive: true
    }
  },
  processing: {
    concurrency: 3,
    tempDirectory: './temp',
    cleanupEnabled: true,
    cleanupIntervalMs: 60000, // 1分
    processors: {
      sharp: {
        enabled: true,
        options: {}
      }
    }
  },
  logging: {
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: false,
    filePath: './logs/image-upload.log',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    retentionDays: 30,
    enableColors: true,
    enableTimestamp: true,
    enableStackTrace: true,
    correlationIdLength: 8
  },
  performance: {
    enableMetrics: true,
    metricsInterval: 60000, // 1分
    slowOperationThreshold: 1000, // 1秒
    memoryUsageThreshold: 512 * 1024 * 1024 // 512MB
  },
  security: {
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxRequestsPerMinute: 30,
    enableContentValidation: true,
    quarantineDirectory: './quarantine',
    enableVirusScanning: false
  },
  development: {
    enabled: process.env.NODE_ENV === 'development',
    mockUploads: false,
    skipValidation: false,
    debugMode: false,
    verboseLogging: false
  }
};

/**
 * 環境変数ベースの設定プロバイダー
 */
export class EnvironmentConfigProvider implements ConfigProvider {
  private envVars: Partial<EnvironmentVariables>;

  constructor(envVars?: Partial<EnvironmentVariables>) {
    this.envVars = envVars || process.env;
  }

  async load(): Promise<ApplicationConfig> {
    const config: ApplicationConfig = {
      sanity: {
        projectId: this.getEnvVar('VITE_SANITY_PROJECT_ID') || DEFAULT_CONFIG.sanity.projectId,
        dataset: this.getEnvVar('VITE_SANITY_DATASET') || DEFAULT_CONFIG.sanity.dataset,
        apiVersion: this.getEnvVar('VITE_SANITY_API_VERSION') || DEFAULT_CONFIG.sanity.apiVersion,
        token: this.getEnvVar('VITE_SANITY_TOKEN') || DEFAULT_CONFIG.sanity.token,
        useCdn: this.getBooleanEnvVar('VITE_SANITY_USE_CDN') ?? DEFAULT_CONFIG.sanity.useCdn,
        timeout: this.getNumberEnvVar('VITE_SANITY_TIMEOUT') || DEFAULT_CONFIG.sanity.timeout,
        retryAttempts: this.getNumberEnvVar('VITE_SANITY_RETRY_ATTEMPTS') || DEFAULT_CONFIG.sanity.retryAttempts,
        retryDelay: this.getNumberEnvVar('VITE_SANITY_RETRY_DELAY') || DEFAULT_CONFIG.sanity.retryDelay
      },
      image: {
        maxFileSize: this.getNumberEnvVar('IMAGE_MAX_FILE_SIZE') || DEFAULT_CONFIG.image.maxFileSize,
        allowedFormats: this.getArrayEnvVar('IMAGE_ALLOWED_FORMATS') || DEFAULT_CONFIG.image.allowedFormats,
        optimizationQuality: this.getNumberEnvVar('IMAGE_OPTIMIZATION_QUALITY') || DEFAULT_CONFIG.image.optimizationQuality,
        autoGenerateAlt: this.getBooleanEnvVar('IMAGE_AUTO_GENERATE_ALT') ?? DEFAULT_CONFIG.image.autoGenerateAlt,
        resize: {
          maxWidth: this.getNumberEnvVar('IMAGE_RESIZE_MAX_WIDTH') || DEFAULT_CONFIG.image.resize.maxWidth,
          maxHeight: this.getNumberEnvVar('IMAGE_RESIZE_MAX_HEIGHT') || DEFAULT_CONFIG.image.resize.maxHeight,
          maintainAspectRatio: DEFAULT_CONFIG.image.resize.maintainAspectRatio
        },
        compression: {
          enabled: this.getBooleanEnvVar('IMAGE_COMPRESSION_ENABLED') ?? DEFAULT_CONFIG.image.compression.enabled,
          quality: this.getNumberEnvVar('IMAGE_COMPRESSION_QUALITY') || DEFAULT_CONFIG.image.compression.quality,
          progressive: DEFAULT_CONFIG.image.compression.progressive
        }
      },
      processing: {
        concurrency: this.getNumberEnvVar('PROCESSING_CONCURRENCY') || DEFAULT_CONFIG.processing.concurrency,
        tempDirectory: this.getEnvVar('PROCESSING_TEMP_DIRECTORY') || DEFAULT_CONFIG.processing.tempDirectory,
        cleanupEnabled: this.getBooleanEnvVar('PROCESSING_CLEANUP_ENABLED') ?? DEFAULT_CONFIG.processing.cleanupEnabled,
        cleanupIntervalMs: this.getNumberEnvVar('PROCESSING_CLEANUP_INTERVAL') || DEFAULT_CONFIG.processing.cleanupIntervalMs,
        processors: DEFAULT_CONFIG.processing.processors
      },
      logging: {
        level: this.getLogLevelEnvVar('LOG_LEVEL') || DEFAULT_CONFIG.logging.level,
        enableConsole: this.getBooleanEnvVar('LOG_ENABLE_CONSOLE') ?? DEFAULT_CONFIG.logging.enableConsole,
        enableFile: this.getBooleanEnvVar('LOG_ENABLE_FILE') ?? DEFAULT_CONFIG.logging.enableFile,
        filePath: this.getEnvVar('LOG_FILE_PATH') || DEFAULT_CONFIG.logging.filePath,
        maxFileSize: this.getNumberEnvVar('LOG_MAX_FILE_SIZE') || DEFAULT_CONFIG.logging.maxFileSize,
        maxFiles: this.getNumberEnvVar('LOG_MAX_FILES') || DEFAULT_CONFIG.logging.maxFiles,
        retentionDays: this.getNumberEnvVar('LOG_RETENTION_DAYS') || DEFAULT_CONFIG.logging.retentionDays,
        enableColors: this.getBooleanEnvVar('LOG_ENABLE_COLORS') ?? DEFAULT_CONFIG.logging.enableColors,
        enableTimestamp: this.getBooleanEnvVar('LOG_ENABLE_TIMESTAMP') ?? DEFAULT_CONFIG.logging.enableTimestamp,
        enableStackTrace: this.getBooleanEnvVar('LOG_ENABLE_STACK_TRACE') ?? DEFAULT_CONFIG.logging.enableStackTrace,
        correlationIdLength: this.getNumberEnvVar('LOG_CORRELATION_ID_LENGTH') || DEFAULT_CONFIG.logging.correlationIdLength
      },
      performance: {
        enableMetrics: this.getBooleanEnvVar('PERFORMANCE_ENABLE_METRICS') ?? DEFAULT_CONFIG.performance.enableMetrics,
        metricsInterval: this.getNumberEnvVar('PERFORMANCE_METRICS_INTERVAL') || DEFAULT_CONFIG.performance.metricsInterval,
        slowOperationThreshold: this.getNumberEnvVar('PERFORMANCE_SLOW_OPERATION_THRESHOLD') || DEFAULT_CONFIG.performance.slowOperationThreshold,
        memoryUsageThreshold: this.getNumberEnvVar('PERFORMANCE_MEMORY_USAGE_THRESHOLD') || DEFAULT_CONFIG.performance.memoryUsageThreshold
      },
      security: {
        allowedFileTypes: this.getArrayEnvVar('SECURITY_ALLOWED_FILE_TYPES') || DEFAULT_CONFIG.security.allowedFileTypes,
        maxRequestsPerMinute: this.getNumberEnvVar('SECURITY_MAX_REQUESTS_PER_MINUTE') || DEFAULT_CONFIG.security.maxRequestsPerMinute,
        enableContentValidation: this.getBooleanEnvVar('SECURITY_ENABLE_CONTENT_VALIDATION') ?? DEFAULT_CONFIG.security.enableContentValidation,
        quarantineDirectory: this.getEnvVar('SECURITY_QUARANTINE_DIRECTORY') || DEFAULT_CONFIG.security.quarantineDirectory,
        enableVirusScanning: this.getBooleanEnvVar('SECURITY_ENABLE_VIRUS_SCANNING') ?? DEFAULT_CONFIG.security.enableVirusScanning
      },
      development: {
        enabled: this.getBooleanEnvVar('DEVELOPMENT_ENABLED') ?? DEFAULT_CONFIG.development.enabled,
        mockUploads: this.getBooleanEnvVar('DEVELOPMENT_MOCK_UPLOADS') ?? DEFAULT_CONFIG.development.mockUploads,
        skipValidation: this.getBooleanEnvVar('DEVELOPMENT_SKIP_VALIDATION') ?? DEFAULT_CONFIG.development.skipValidation,
        debugMode: this.getBooleanEnvVar('DEVELOPMENT_DEBUG_MODE') ?? DEFAULT_CONFIG.development.debugMode,
        verboseLogging: this.getBooleanEnvVar('DEVELOPMENT_VERBOSE_LOGGING') ?? DEFAULT_CONFIG.development.verboseLogging
      }
    };

    return config;
  }

  async save(config: ApplicationConfig): Promise<void> {
    // 環境変数ベースの設定は直接保存できないため、エラーを投げる
    throw new Error('Environment-based configuration cannot be saved directly. Please update environment variables.');
  }

  validate(config: ApplicationConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 必須項目の検証
    if (!config.sanity.projectId) {
      errors.push({
        field: 'sanity.projectId',
        message: 'Sanity Project ID is required',
        value: config.sanity.projectId,
        constraint: 'required'
      });
    }

    if (!config.sanity.token) {
      errors.push({
        field: 'sanity.token',
        message: 'Sanity Token is required',
        value: config.sanity.token,
        constraint: 'required'
      });
    }

    // 数値の範囲検証
    if (config.image.maxFileSize <= 0) {
      errors.push({
        field: 'image.maxFileSize',
        message: 'Maximum file size must be positive',
        value: config.image.maxFileSize,
        constraint: 'positive'
      });
    }

    if (config.image.maxFileSize > 50 * 1024 * 1024) {
      warnings.push({
        field: 'image.maxFileSize',
        message: 'Maximum file size is very large',
        value: config.image.maxFileSize,
        recommendation: 'Consider reducing to improve performance'
      });
    }

    if (config.image.optimizationQuality < 1 || config.image.optimizationQuality > 100) {
      errors.push({
        field: 'image.optimizationQuality',
        message: 'Optimization quality must be between 1 and 100',
        value: config.image.optimizationQuality,
        constraint: 'range'
      });
    }

    if (config.processing.concurrency <= 0) {
      errors.push({
        field: 'processing.concurrency',
        message: 'Processing concurrency must be positive',
        value: config.processing.concurrency,
        constraint: 'positive'
      });
    }

    if (config.processing.concurrency > 10) {
      warnings.push({
        field: 'processing.concurrency',
        message: 'High concurrency may cause performance issues',
        value: config.processing.concurrency,
        recommendation: 'Consider reducing to 3-5'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  watch(callback: (config: ApplicationConfig) => void): void {
    // 環境変数の変更監視は複雑なため、基本実装では対応しない
    console.warn('Environment variable watching is not implemented');
  }

  unwatch(): void {
    // 何もしない
  }

  private getEnvVar(key: string): string | undefined {
    return this.envVars[key as keyof EnvironmentVariables];
  }

  private getNumberEnvVar(key: string): number | undefined {
    const value = this.getEnvVar(key);
    return value ? parseInt(value, 10) : undefined;
  }

  private getBooleanEnvVar(key: string): boolean | undefined {
    const value = this.getEnvVar(key);
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true';
  }

  private getArrayEnvVar(key: string): string[] | undefined {
    const value = this.getEnvVar(key);
    return value ? value.split(',').map(v => v.trim()) : undefined;
  }

  private getLogLevelEnvVar(key: string): LogLevel | undefined {
    const value = this.getEnvVar(key);
    if (!value) return undefined;
    
    switch (value.toLowerCase()) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return undefined;
    }
  }
}

/**
 * 設定マネージャーの実装
 */
export class ApplicationConfigManager implements ConfigManager {
  private config: ApplicationConfig;
  private provider: ConfigProvider;
  private changeListeners: Set<(config: ApplicationConfig) => void> = new Set();

  constructor(provider: ConfigProvider) {
    this.provider = provider;
    this.config = DEFAULT_CONFIG;
  }

  async initialize(): Promise<void> {
    this.config = await this.provider.load();
    
    // 設定の検証
    const validationResult = this.provider.validate(this.config);
    if (!validationResult.isValid) {
      throw new Error(`Configuration validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
    }

    // 警告の出力
    if (validationResult.warnings.length > 0) {
      console.warn('Configuration warnings:', validationResult.warnings);
    }
  }

  getConfig(): ApplicationConfig {
    return this.config;
  }

  getSanityConfig() {
    return this.config.sanity;
  }

  getImageConfig() {
    return this.config.image;
  }

  getProcessingConfig() {
    return this.config.processing;
  }

  getLoggingConfig() {
    return this.config.logging;
  }

  getPerformanceConfig() {
    return this.config.performance;
  }

  getSecurityConfig() {
    return this.config.security;
  }

  getDevelopmentConfig() {
    return this.config.development;
  }

  async updateConfig(config: Partial<ApplicationConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await this.provider.save(this.config);
    this.notifyListeners();
  }

  async reload(): Promise<void> {
    this.config = await this.provider.load();
    this.notifyListeners();
  }

  onConfigChange(callback: (config: ApplicationConfig) => void): void {
    this.changeListeners.add(callback);
  }

  offConfigChange(callback: (config: ApplicationConfig) => void): void {
    this.changeListeners.delete(callback);
  }

  private notifyListeners(): void {
    for (const listener of this.changeListeners) {
      listener(this.config);
    }
  }
}

/**
 * デフォルトの設定マネージャーインスタンス
 */
let defaultConfigManager: ApplicationConfigManager | null = null;

/**
 * デフォルトの設定マネージャーを取得
 */
export async function getDefaultConfigManager(): Promise<ApplicationConfigManager> {
  if (!defaultConfigManager) {
    const provider = new EnvironmentConfigProvider();
    defaultConfigManager = new ApplicationConfigManager(provider);
    await defaultConfigManager.initialize();
  }
  return defaultConfigManager;
}

/**
 * 設定マネージャーをリセット（主にテスト用）
 */
export function resetConfigManager(): void {
  defaultConfigManager = null;
}