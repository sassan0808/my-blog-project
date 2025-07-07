import { BaseError } from '../errors/base-error';

/**
 * ログレベル
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * ログエントリーのメタデータ
 */
export interface LogMetadata {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, any>;
  error?: Error | BaseError;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * ログ出力先の設定
 */
export interface LogDestination {
  name: string;
  enabled: boolean;
  minLevel: LogLevel;
  format?: 'json' | 'text';
  maxFileSize?: number;
  maxFiles?: number;
  filePath?: string;
}

/**
 * ロガーの設定
 */
export interface LoggerConfig {
  level: LogLevel;
  destinations: LogDestination[];
  enableStackTrace: boolean;
  enableTimestamp: boolean;
  enableColors: boolean;
  correlationIdLength: number;
}

/**
 * ログフォーマッター
 */
export interface LogFormatter {
  format(entry: LogMetadata): string;
}

/**
 * ログ出力インターフェース
 */
export interface LogOutput {
  write(formattedMessage: string, entry: LogMetadata): Promise<void>;
  close?(): Promise<void>;
}

/**
 * ロガーのメインインターフェース
 */
export interface Logger {
  /**
   * デバッグレベルのログ
   */
  debug(message: string, context?: string, data?: Record<string, any>): void;

  /**
   * 情報レベルのログ
   */
  info(message: string, context?: string, data?: Record<string, any>): void;

  /**
   * 警告レベルのログ
   */
  warn(message: string, context?: string, data?: Record<string, any>): void;

  /**
   * エラーレベルのログ
   */
  error(message: string, error?: Error | BaseError, context?: string, data?: Record<string, any>): void;

  /**
   * 子ロガーの作成（コンテキスト付き）
   */
  child(context: string, data?: Record<string, any>): Logger;

  /**
   * 相関IDの設定
   */
  setCorrelationId(correlationId: string): void;

  /**
   * ユーザーIDの設定
   */
  setUserId(userId: string): void;

  /**
   * セッションIDの設定
   */
  setSessionId(sessionId: string): void;

  /**
   * ログレベルの設定
   */
  setLevel(level: LogLevel): void;

  /**
   * 現在のログレベルを取得
   */
  getLevel(): LogLevel;

  /**
   * 指定されたレベルのログが有効かどうかを確認
   */
  isLevelEnabled(level: LogLevel): boolean;

  /**
   * ロガーのクリーンアップ
   */
  close(): Promise<void>;
}

/**
 * ロガーファクトリー
 */
export interface LoggerFactory {
  createLogger(config: LoggerConfig): Logger;
  createDefaultLogger(): Logger;
}

/**
 * パフォーマンス測定用のロガー
 */
export interface PerformanceLogger {
  /**
   * 処理時間の測定を開始
   */
  startTimer(operation: string, context?: string): () => void;

  /**
   * 処理時間を記録
   */
  recordDuration(operation: string, durationMs: number, context?: string, data?: Record<string, any>): void;

  /**
   * メモリ使用量を記録
   */
  recordMemoryUsage(operation: string, context?: string): void;
}

/**
 * ログ分析用のインターフェース
 */
export interface LogAnalyzer {
  /**
   * エラー率の計算
   */
  calculateErrorRate(timeWindowMs: number): Promise<number>;

  /**
   * 最も頻繁に発生するエラーのリストを取得
   */
  getTopErrors(limit: number, timeWindowMs: number): Promise<Array<{ error: string; count: number }>>;

  /**
   * パフォーマンスメトリクスの取得
   */
  getPerformanceMetrics(operation: string, timeWindowMs: number): Promise<{
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p95Duration: number;
    count: number;
  }>;
}