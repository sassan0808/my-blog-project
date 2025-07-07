#!/usr/bin/env tsx

/**
 * 画像付き記事作成のインタラクティブCLI
 * 
 * 使用方法:
 * npx tsx src/scripts/create-article-with-images-interactive.ts
 */

import { promises as fs } from 'fs';
import path from 'path';
import readline from 'readline';
import { 
  CreateArticleWithImagesUseCase,
  CreateArticleRequest,
  createArticleWithImagesUseCase
} from '../lib/application/use-cases/create-article-with-images';
import { ArticleCategory } from '../lib/domain/entities/article';
import { ImageReference, ImagePlacement } from '../lib/domain/entities/media.interface';
import { getDefaultConfigManager } from '../lib/core/config/environment-config';
import { createDefaultLogger } from '../lib/core/logging/console-logger';
import { Logger } from '../lib/core/logging/logger.interface';

/**
 * CLI の状態管理
 */
interface CLIState {
  title: string;
  content: string;
  category?: ArticleCategory;
  tags: string[];
  images: ImageReference[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  publish: boolean;
  optimizeImages: boolean;
  analyzeImages: boolean;
}

/**
 * メインのCLIクラス
 */
class CreateArticleWithImagesCLI {
  private rl: readline.Interface;
  private logger: Logger;
  private useCase?: CreateArticleWithImagesUseCase;
  private state: CLIState;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.logger = createDefaultLogger().child('CreateArticleCLI');
    
    this.state = {
      title: '',
      content: '',
      tags: [],
      images: [],
      seo: {},
      publish: false,
      optimizeImages: true,
      analyzeImages: true
    };
  }

  async run(): Promise<void> {
    try {
      console.log('\n🎨 画像付き記事作成システム');
      console.log('=====================================\n');

      // 設定の初期化
      await this.initializeSystem();

      // インタラクティブな質問フロー
      await this.collectBasicInfo();
      await this.collectImages();
      await this.collectSEOInfo();
      await this.collectPublishingOptions();

      // 確認画面
      await this.showSummary();

      // 実行確認
      const confirmed = await this.askQuestion('📝 この内容で記事を作成しますか？ (y/N): ');
      
      if (confirmed.toLowerCase() === 'y' || confirmed.toLowerCase() === 'yes') {
        await this.executeCreation();
      } else {
        console.log('\n❌ 記事作成をキャンセルしました。');
      }

    } catch (error) {
      console.error('\n❌ エラーが発生しました:', (error as Error).message);
      this.logger.error('CLI execution failed', error as Error, 'run');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  private async initializeSystem(): Promise<void> {
    console.log('⚙️  システムを初期化しています...');
    
    try {
      const configManager = await getDefaultConfigManager();
      const config = configManager.getConfig();
      
      this.useCase = createArticleWithImagesUseCase(config, this.logger);
      
      console.log('✅ システムの初期化が完了しました。\n');
    } catch (error) {
      throw new Error(`システムの初期化に失敗しました: ${(error as Error).message}`);
    }
  }

  private async collectBasicInfo(): Promise<void> {
    console.log('📝 基本情報を入力してください:\n');

    // タイトル
    this.state.title = await this.askQuestion('タイトル: ', {
      required: true,
      maxLength: 100
    });

    // カテゴリー
    await this.selectCategory();

    // コンテンツ
    console.log('\n📄 記事の内容を入力してください:');
    console.log('(複数行の入力が可能です。完了したら空行を2回入力してください)\n');
    
    this.state.content = await this.collectMultilineInput();

    // タグ
    const tagsInput = await this.askQuestion('\n🏷️  タグ (カンマ区切り): ');
    if (tagsInput.trim()) {
      this.state.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }

  private async selectCategory(): Promise<void> {
    console.log('\n📂 カテゴリーを選択してください:');
    console.log('1. AI活用');
    console.log('2. 組織開発');
    console.log('3. Well-being');

    while (!this.state.category) {
      const choice = await this.askQuestion('選択 (1-3): ');
      
      switch (choice) {
        case '1':
          this.state.category = ArticleCategory.AI_UTILIZATION;
          break;
        case '2':
          this.state.category = ArticleCategory.ORGANIZATION_DEVELOPMENT;
          break;
        case '3':
          this.state.category = ArticleCategory.WELL_BEING;
          break;
        default:
          console.log('❌ 無効な選択です。1-3の数字を入力してください。');
      }
    }

    console.log(`✅ カテゴリー: ${this.state.category}`);
  }

  private async collectImages(): Promise<void> {
    console.log('\n🖼️  画像を追加しますか？\n');

    const addImages = await this.askQuestion('画像を追加しますか？ (y/N): ');
    
    if (addImages.toLowerCase() === 'y' || addImages.toLowerCase() === 'yes') {
      let addMore = true;
      let imageIndex = 1;

      while (addMore) {
        console.log(`\n--- 画像 ${imageIndex} ---`);
        
        const imagePath = await this.askQuestion('画像ファイルのパス: ', {
          required: true,
          validator: async (path: string) => {
            try {
              await fs.access(path);
              return true;
            } catch {
              return '指定されたファイルが見つかりません。';
            }
          }
        });

        const altText = await this.askQuestion('Alt テキスト (省略可): ');
        const caption = await this.askQuestion('キャプション (省略可): ');

        const imageRef: ImageReference = {
          filePath: imagePath,
          altText: altText || undefined,
          caption: caption || undefined,
          placement: ImagePlacement.FIGURE
        };

        this.state.images.push(imageRef);
        imageIndex++;

        const continueAdding = await this.askQuestion('他の画像も追加しますか？ (y/N): ');
        addMore = continueAdding.toLowerCase() === 'y' || continueAdding.toLowerCase() === 'yes';
      }

      console.log(`✅ ${this.state.images.length}個の画像が追加されました。`);
    }
  }

  private async collectSEOInfo(): Promise<void> {
    console.log('\n🔍 SEO設定 (省略可):\n');

    const addSEO = await this.askQuestion('SEO設定を追加しますか？ (y/N): ');
    
    if (addSEO.toLowerCase() === 'y' || addSEO.toLowerCase() === 'yes') {
      this.state.seo.metaTitle = await this.askQuestion('Meta Title (60文字以内): ', {
        maxLength: 60
      }) || undefined;

      this.state.seo.metaDescription = await this.askQuestion('Meta Description (160文字以内): ', {
        maxLength: 160
      }) || undefined;
    }
  }

  private async collectPublishingOptions(): Promise<void> {
    console.log('\n⚙️  処理オプション:\n');

    // 公開設定
    const publishChoice = await this.askQuestion('記事を即座に公開しますか？ (y/N): ');
    this.state.publish = publishChoice.toLowerCase() === 'y' || publishChoice.toLowerCase() === 'yes';

    // 画像最適化
    if (this.state.images.length > 0) {
      const optimizeChoice = await this.askQuestion('画像を最適化しますか？ (Y/n): ');
      this.state.optimizeImages = optimizeChoice.toLowerCase() !== 'n' && optimizeChoice.toLowerCase() !== 'no';

      const analyzeChoice = await this.askQuestion('画像を解析しますか？ (Y/n): ');
      this.state.analyzeImages = analyzeChoice.toLowerCase() !== 'n' && analyzeChoice.toLowerCase() !== 'no';
    }
  }

  private async showSummary(): Promise<void> {
    console.log('\n📋 作成する記事の概要:');
    console.log('=====================================');
    console.log(`タイトル: ${this.state.title}`);
    console.log(`カテゴリー: ${this.state.category}`);
    console.log(`タグ: ${this.state.tags.join(', ') || 'なし'}`);
    console.log(`画像数: ${this.state.images.length}個`);
    console.log(`文字数: 約${this.state.content.length}文字`);
    console.log(`公開設定: ${this.state.publish ? '即座に公開' : 'ドラフトとして保存'}`);
    
    if (this.state.images.length > 0) {
      console.log(`画像最適化: ${this.state.optimizeImages ? '有効' : '無効'}`);
      console.log(`画像解析: ${this.state.analyzeImages ? '有効' : '無効'}`);
    }

    if (this.state.seo.metaTitle || this.state.seo.metaDescription) {
      console.log('\nSEO設定:');
      if (this.state.seo.metaTitle) {
        console.log(`  Meta Title: ${this.state.seo.metaTitle}`);
      }
      if (this.state.seo.metaDescription) {
        console.log(`  Meta Description: ${this.state.seo.metaDescription}`);
      }
    }

    if (this.state.images.length > 0) {
      console.log('\n画像一覧:');
      this.state.images.forEach((img, index) => {
        console.log(`  ${index + 1}. ${path.basename(img.filePath)}`);
        if (img.altText) console.log(`     Alt: ${img.altText}`);
        if (img.caption) console.log(`     Caption: ${img.caption}`);
      });
    }

    console.log('=====================================\n');
  }

  private async executeCreation(): Promise<void> {
    if (!this.useCase) {
      throw new Error('システムが初期化されていません。');
    }

    console.log('\n⏳ 記事を作成しています...\n');

    const request: CreateArticleRequest = {
      title: this.state.title,
      content: this.state.content,
      category: this.state.category!,
      tags: this.state.tags.length > 0 ? this.state.tags : undefined,
      images: this.state.images.length > 0 ? this.state.images : undefined,
      seo: (this.state.seo.metaTitle || this.state.seo.metaDescription) ? this.state.seo : undefined,
      publish: this.state.publish,
      optimizeImages: this.state.optimizeImages,
      analyzeImages: this.state.analyzeImages
    };

    try {
      const result = await this.useCase.execute(request);

      if (result.success && result.article) {
        console.log('✅ 記事が正常に作成されました！\n');
        console.log('📊 結果:');
        console.log(`   記事ID: ${result.article.id}`);
        console.log(`   タイトル: ${result.article.title}`);
        console.log(`   URL: ${result.article.url}`);
        console.log(`   ステータス: ${result.article.status}`);
        
        if (result.article.publishedAt) {
          console.log(`   公開日時: ${result.article.publishedAt.toLocaleString('ja-JP')}`);
        }

        if (result.uploadedImages.length > 0) {
          console.log(`\n🖼️  アップロードされた画像: ${result.uploadedImages.length}個`);
          result.uploadedImages.forEach((img, index) => {
            console.log(`   ${index + 1}. ${path.basename(img.originalPath)}`);
            console.log(`      URL: ${img.uploadedMedia.url}`);
            
            if (img.processingStats) {
              const stats = img.processingStats;
              console.log(`      圧縮率: ${stats.compressionRatio}% (${this.formatFileSize(stats.originalSize)} → ${this.formatFileSize(stats.processedSize)})`);
            }
          });
        }

        console.log(`\n⏱️  処理時間:`);
        console.log(`   総時間: ${result.performance.totalTime}ms`);
        if (result.performance.imageProcessingTime > 0) {
          console.log(`   画像処理: ${result.performance.imageProcessingTime}ms`);
        }
        if (result.performance.uploadTime > 0) {
          console.log(`   アップロード: ${result.performance.uploadTime}ms`);
        }
        console.log(`   記事作成: ${result.performance.articleCreationTime}ms`);

        if (result.warnings.length > 0) {
          console.log('\n⚠️  警告:');
          result.warnings.forEach(warning => console.log(`   - ${warning}`));
        }

      } else {
        console.log('❌ 記事の作成に失敗しました。\n');
        
        if (result.errors.length > 0) {
          console.log('エラー:');
          result.errors.forEach(error => console.log(`   - ${error}`));
        }
      }

    } catch (error) {
      console.error('❌ 予期しないエラーが発生しました:', (error as Error).message);
      this.logger.error('Article creation failed', error as Error, 'executeCreation');
    }
  }

  // ユーティリティメソッド

  private async askQuestion(
    prompt: string, 
    options?: {
      required?: boolean;
      maxLength?: number;
      validator?: (input: string) => Promise<boolean | string>;
    }
  ): Promise<string> {
    return new Promise((resolve) => {
      const ask = () => {
        this.rl.question(prompt, async (answer) => {
          const trimmed = answer.trim();

          // 必須チェック
          if (options?.required && !trimmed) {
            console.log('❌ この項目は必須です。');
            ask();
            return;
          }

          // 文字数チェック
          if (options?.maxLength && trimmed.length > options.maxLength) {
            console.log(`❌ ${options.maxLength}文字以内で入力してください。`);
            ask();
            return;
          }

          // カスタムバリデーション
          if (options?.validator) {
            const validationResult = await options.validator(trimmed);
            if (validationResult !== true) {
              console.log(`❌ ${typeof validationResult === 'string' ? validationResult : '入力が無効です。'}`);
              ask();
              return;
            }
          }

          resolve(trimmed);
        });
      };
      ask();
    });
  }

  private async collectMultilineInput(): Promise<string> {
    return new Promise((resolve) => {
      const lines: string[] = [];
      let emptyLineCount = 0;

      const processLine = (line: string) => {
        if (line.trim() === '') {
          emptyLineCount++;
          if (emptyLineCount >= 2) {
            // 2回連続の空行で終了
            this.rl.removeListener('line', processLine);
            resolve(lines.join('\n'));
            return;
          }
        } else {
          emptyLineCount = 0;
        }
        lines.push(line);
      };

      this.rl.on('line', processLine);
    });
  }

  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }
}

// CLI実行
if (require.main === module) {
  const cli = new CreateArticleWithImagesCLI();
  cli.run().catch((error) => {
    console.error('CLI execution failed:', error);
    process.exit(1);
  });
}