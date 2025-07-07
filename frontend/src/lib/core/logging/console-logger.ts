import type { Logger, LogMetadata, LoggerConfig, PerformanceLogger } from './logger.interface';
import { LogLevel } from './logger.interface';
import { BaseError } from '../errors/base-error';

/**
 * コンソール出力用のロガー実装
 */
export class ConsoleLogger implements Logger, PerformanceLogger {
  private config: LoggerConfig;
  private correlationId?: string;
  private userId?: string;
  private sessionId?: string;
  private context?: string;
  private contextData?: Record<string, unknown>;
  private timers: Map<string, number> = new Map();

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  /**
   * カラーコードの定義
   */
  private static readonly COLORS = {
    DEBUG: '\x1b[36m',    // Cyan
    INFO: '\x1b[32m',     // Green
    WARN: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',    // Red
    RESET: '\x1b[0m',     // Reset
    BRIGHT: '\x1b[1m',    // Bright
    DIM: '\x1b[2m'        // Dim
  };

  /**
   * ログレベルの文字列表現
   */
  private static readonly LEVEL_NAMES = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR'
  };

  /**
   * ログレベルの絵文字
   */
  private static readonly LEVEL_EMOJIS = {
    [LogLevel.DEBUG]: '🔍',
    [LogLevel.INFO]: '📋',
    [LogLevel.WARN]: '⚠️',
    [LogLevel.ERROR]: '🚨'
  };

  debug(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, error?: Error | BaseError, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, data, error);
  }

  private log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>, error?: Error | BaseError): void {
    if (!this.isLevelEnabled(level)) {
      return;
    }

    const entry: LogMetadata = {
      timestamp: new Date(),
      level,
      message,
      context: context || this.context,
      data: { ...this.contextData, ...data },
      error,
      correlationId: this.correlationId,
      userId: this.userId,
      sessionId: this.sessionId
    };

    const formattedMessage = this.formatMessage(entry);
    
    // 出力先の判定
    const output = level >= LogLevel.ERROR ? console.error : console.log;
    output(formattedMessage);

    // エラーの場合はスタックトレースも出力
    if (error && this.config.enableStackTrace) {
      if (error instanceof BaseError) {
        console.error(`📋 Error Details:`, error.toJSON());
      } else {
        console.error(`📋 Stack Trace:`, error.stack);
      }
    }
  }

  private formatMessage(entry: LogMetadata): string {
    const parts: string[] = [];

    // タイムスタンプ
    if (this.config.enableTimestamp) {
      const timestamp = entry.timestamp.toISOString();
      parts.push(`${ConsoleLogger.COLORS.DIM}[${timestamp}]${ConsoleLogger.COLORS.RESET}`);
    }

    // レベル
    const levelName = ConsoleLogger.LEVEL_NAMES[entry.level];
    const levelEmoji = ConsoleLogger.LEVEL_EMOJIS[entry.level];
    const levelColor = this.getLevelColor(entry.level);
    
    if (this.config.enableColors) {
      parts.push(`${levelColor}${levelEmoji} ${levelName}${ConsoleLogger.COLORS.RESET}`);
    } else {
      parts.push(`${levelEmoji} ${levelName}`);
    }

    // 相関ID
    if (entry.correlationId) {
      parts.push(`${ConsoleLogger.COLORS.DIM}[${entry.correlationId}]${ConsoleLogger.COLORS.RESET}`);
    }

    // コンテキスト
    if (entry.context) {
      parts.push(`${ConsoleLogger.COLORS.BRIGHT}[${entry.context}]${ConsoleLogger.COLORS.RESET}`);
    }

    // メッセージ
    parts.push(entry.message);

    // データ
    if (entry.data && Object.keys(entry.data).length > 0) {
      const dataStr = JSON.stringify(entry.data, null, 2);
      parts.push(`\n${ConsoleLogger.COLORS.DIM}${dataStr}${ConsoleLogger.COLORS.RESET}`);
    }

    return parts.join(' ');
  }

  private getLevelColor(level: LogLevel): string {
    if (!this.config.enableColors) {
      return '';
    }

    switch (level) {
      case LogLevel.DEBUG: return ConsoleLogger.COLORS.DEBUG;
      case LogLevel.INFO: return ConsoleLogger.COLORS.INFO;
      case LogLevel.WARN: return ConsoleLogger.COLORS.WARN;
      case LogLevel.ERROR: return ConsoleLogger.COLORS.ERROR;
      default: return '';
    }
  }

  child(context: string, data?: Record<string, unknown>): Logger {
    const childLogger = new ConsoleLogger(this.config);
    childLogger.correlationId = this.correlationId;
    childLogger.userId = this.userId;
    childLogger.sessionId = this.sessionId;
    childLogger.context = context;
    childLogger.contextData = { ...this.contextData, ...data };
    return childLogger;
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  getLevel(): LogLevel {
    return this.config.level;
  }

  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  async close(): Promise<void> {
    // コンソールロガーはクリーンアップが不要
  }

  // PerformanceLogger の実装
  startTimer(operation: string, context?: string): () => void {
    const key = `${operation}:${context || 'default'}`;
    this.timers.set(key, Date.now());
    
    return () => {
      const startTime = this.timers.get(key);
      if (startTime) {
        const duration = Date.now() - startTime;
        this.recordDuration(operation, duration, context);
        this.timers.delete(key);
      }
    };
  }

  recordDuration(operation: string, durationMs: number, context?: string, data?: Record<string, unknown>): void {
    const emoji = durationMs > 1000 ? '🐌' : durationMs > 100 ? '⏳' : '⚡';
    this.info(`${emoji} ${operation} completed in ${durationMs}ms`, context, {
      operation,
      duration: durationMs,
      ...data
    });
  }

  recordMemoryUsage(operation: string, context?: string): void {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      this.info(`🧠 Memory usage for ${operation}`, context, {
        operation,
        memory: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024 * 100) / 100} MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`
        }
      });
    }
  }
}

/**
 * デフォルトのロガー設定
 */
export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  destinations: [
    {
      name: 'console',
      enabled: true,
      minLevel: LogLevel.DEBUG,
      format: 'text'
    }
  ],
  enableStackTrace: true,
  enableTimestamp: true,
  enableColors: true,
  correlationIdLength: 8
};

/**
 * デフォルトのロガーインスタンスを作成
 */
export function createDefaultLogger(): ConsoleLogger {
  return new ConsoleLogger(DEFAULT_LOGGER_CONFIG);
}

/**
 * 相関IDを生成
 */
export function generateCorrelationId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}