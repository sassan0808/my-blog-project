#!/usr/bin/env tsx

// 環境変数の読み込み
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { getDefaultConfigManager } from './src/lib/core/config/environment-config';
import { createDefaultLogger } from './src/lib/core/logging/console-logger';
import { createSanityArticlePublisher } from './src/lib/infrastructure/sanity/sanity-article-publisher';

async function publishArticle() {
  try {
    console.log('📰 記事公開処理開始...\n');

    // システム初期化
    const configManager = await getDefaultConfigManager();
    const config = configManager.getConfig();
    const logger = createDefaultLogger().child('PublishArticle');
    const publisher = createSanityArticlePublisher(config.sanity, logger);

    // 記事IDを指定
    const articleId = 'article_1751881382872_c9jc70q28';
    
    console.log(`記事ID: ${articleId}`);
    console.log('公開処理実行中...\n');

    // ドラフトを公開
    const publishedArticle = await publisher.publishDraft(articleId);

    console.log('✅ 記事公開成功！\n');
    console.log('📊 結果:');
    console.log(`記事ID: ${publishedArticle._id}`);
    console.log(`タイトル: ${publishedArticle.title}`);
    console.log(`ステータス: ${publishedArticle.status}`);
    console.log(`公開日時: ${publishedArticle.publishedAt}`);
    console.log(`URL: ${publishedArticle.slug?.current}`);

  } catch (error) {
    console.error('❌ 公開エラー:', (error as Error).message);
    process.exit(1);
  }
}

publishArticle();