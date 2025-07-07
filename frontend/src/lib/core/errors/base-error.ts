/**
 * アプリケーション内で使用される基底エラークラス
 * すべてのカスタムエラーはこのクラスを継承する
 */
export abstract class BaseError extends Error {
  /**
   * エラーの一意識別子
   */
  public readonly code: string;

  /**
   * HTTPステータスコード（該当する場合）
   */
  public readonly statusCode: number;

  /**
   * 運用上想定されるエラーかどうか
   * true: 正常な業務フロー内で発生しうるエラー
   * false: システムエラーやバグによるエラー
   */
  public readonly isOperational: boolean;

  /**
   * エラーの詳細情報
   */
  public readonly details?: Record<string, any>;

  /**
   * タイムスタンプ
   */
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: Record<string, any>
  ) {
    super(message);
    
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.timestamp = new Date();
    
    // エラーのスタックトレースを正しく設定
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * エラー情報をJSON形式で返す
   */
  toJSON(): Record<string, any> {
    return {
      name: this.constructor.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }

  /**
   * ユーザーフレンドリーなエラーメッセージを返す
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * ログ用のエラーメッセージを返す
   */
  getLogMessage(): string {
    return `[${this.code}] ${this.message}`;
  }
}