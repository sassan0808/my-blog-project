#!/usr/bin/env tsx

// 環境変数の読み込み
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { promises as fs } from 'fs';
import { 
  createArticleWithImagesUseCase
} from './src/lib/application/use-cases/create-article-with-images';
import type { CreateArticleRequest } from './src/lib/application/use-cases/create-article-with-images';
import { ArticleCategories } from './src/lib/domain/entities/article';
import { ImagePlacements } from './src/lib/domain/entities/media.interface';
import { getDefaultConfigManager } from './src/lib/core/config/environment-config';
import { createDefaultLogger } from './src/lib/core/logging/console-logger';

async function createArticle() {
  try {
    console.log('🎨 画像付き記事作成バッチ実行中...\n');

    // システム初期化
    const configManager = await getDefaultConfigManager();
    const config = configManager.getConfig();
    const logger = createDefaultLogger().child('BatchArticleCreation');
    const useCase = createArticleWithImagesUseCase(config, logger);

    // 記事内容を読み込み
    const content = await fs.readFile('./article-content.txt', 'utf8');

    // リクエスト作成
    const request: CreateArticleRequest = {
      title: '「つくる」の民主化 〜ノーコードからAI対話へ〜',
      content: content,
      category: ArticleCategories.AI_UTILIZATION,
      tags: ['AI活用', 'ノーコード', '民主化', 'Claude Code', '創造性'],
      images: [{
        filePath: '/mnt/c/Users/佐々木/Desktop/unnamed.jpg',
        altText: 'AI時代のものづくり革命',
        caption: 'ノーコードからAI対話へのパラダイムシフト',
        placement: ImagePlacements.FIGURE
      }],
      seo: {
        metaTitle: 'AI時代のものづくり革命：ノーコードからAI対話へ',
        metaDescription: 'ノーコードの限界を超え、AI対話による真の創造性の民主化を描く物語。カフェでの出会いから始まる、新しい時代の到来を感じる記事。'
      },
      publish: true,
      optimizeImages: true,
      analyzeImages: true
    };

    console.log('📝 記事作成開始...');
    console.log(`タイトル: ${request.title}`);
    console.log(`カテゴリー: ${request.category}`);
    console.log(`文字数: ${request.content.length}文字`);
    console.log(`画像数: ${request.images?.length || 0}個\n`);

    // 記事作成実行
    const result = await useCase.execute(request);

    if (result.success && result.article) {
      console.log('✅ 記事作成成功！\n');
      console.log('📊 結果:');
      console.log(`記事ID: ${result.article.id}`);
      console.log(`タイトル: ${result.article.title}`);
      console.log(`URL: ${result.article.url}`);
      console.log(`ステータス: ${result.article.status}`);
      
      if (result.article.publishedAt) {
        console.log(`公開日時: ${result.article.publishedAt.toLocaleString('ja-JP')}`);
      }

      if (result.uploadedImages.length > 0) {
        console.log(`\n🖼️ アップロードされた画像: ${result.uploadedImages.length}個`);
        result.uploadedImages.forEach((img, index) => {
          console.log(`${index + 1}. ${img.originalPath}`);
          console.log(`   URL: ${img.uploadedMedia.url}`);
        });
      }

      console.log(`\n⏱️ 処理時間: ${result.performance.totalTime}ms`);

      if (result.warnings.length > 0) {
        console.log('\n⚠️ 警告:');
        result.warnings.forEach(warning => console.log(`- ${warning}`));
      }

    } else {
      console.log('❌ 記事作成失敗\n');
      if (result.errors.length > 0) {
        console.log('エラー:');
        result.errors.forEach(error => console.log(`- ${error}`));
      }
    }

  } catch (error) {
    console.error('❌ エラー:', (error as Error).message);
    process.exit(1);
  }
}

createArticle();