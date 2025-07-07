import { createClient, SanityClient } from '@sanity/client';
import { 
  ArticlePublisher,
  SanityPost
} from './sanity-client.interface';
import { SanityImageUploader } from './sanity-image-uploader';
import { SanityConfig } from '../../core/config/config.interface';
import { Article, ArticleCategory } from '../../domain/entities/article';
import { Image } from '../../domain/entities/image';
import { UploadedMedia } from '../../domain/entities/media.interface';
import { 
  SanityDocumentError,
  SanityConfigurationError
} from '../../core/errors/sanity-error';
import { Logger } from '../../core/logging/logger.interface';
import { createDefaultLogger } from '../../core/logging/console-logger';

/**
 * Sanity記事パブリッシャーの実装
 */
export class SanityArticlePublisher implements ArticlePublisher {
  private client: SanityClient;
  private config: SanityConfig;
  private logger: Logger;
  private imageUploader: SanityImageUploader;

  constructor(config: SanityConfig, logger?: Logger) {
    this.config = config;
    this.logger = logger || createDefaultLogger().child('SanityArticlePublisher');
    
    // Sanityクライアントの初期化
    this.client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      token: config.token,
      useCdn: config.useCdn,
      timeout: config.timeout,
      retryDelay: config.retryDelay,
      maxRetries: config.retryAttempts
    });

    this.imageUploader = new SanityImageUploader(config, logger);
    this.validateConfig();
  }

  async createAndPublish(article: Article): Promise<SanityPost> {
    const stopTimer = this.logger.startTimer('createAndPublish');

    try {
      this.logger.info('Creating and publishing article', 'createAndPublish', {
        title: article.title,
        category: article.category,
        status: article.status
      });

      // 記事を公開状態で作成
      article.publish();
      
      const sanityDocument = await this.createArticleDocument(article);
      
      this.logger.info('Article created and published successfully', 'createAndPublish', {
        articleId: sanityDocument._id,
        title: article.title
      });

      return sanityDocument;
    } catch (error) {
      this.logger.error('Failed to create and publish article', error as Error, 'createAndPublish');
      throw new SanityDocumentError(
        'Failed to create and publish article',
        'create',
        'post',
        undefined,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async createDraft(article: Article): Promise<SanityPost> {
    const stopTimer = this.logger.startTimer('createDraft');

    try {
      this.logger.info('Creating draft article', 'createDraft', {
        title: article.title,
        category: article.category
      });

      // ドラフト状態に設定
      article.unpublish();
      
      const sanityDocument = await this.createArticleDocument(article);
      
      this.logger.info('Draft article created successfully', 'createDraft', {
        articleId: sanityDocument._id,
        title: article.title
      });

      return sanityDocument;
    } catch (error) {
      this.logger.error('Failed to create draft article', error as Error, 'createDraft');
      throw new SanityDocumentError(
        'Failed to create draft article',
        'create',
        'post',
        undefined,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async publishDraft(articleId: string): Promise<SanityPost> {
    const stopTimer = this.logger.startTimer('publishDraft');

    try {
      this.logger.info('Publishing draft article', 'publishDraft', { articleId });

      const updatedDocument = await this.client
        .patch(articleId)
        .set({
          status: 'published',
          publishedAt: new Date().toISOString()
        })
        .commit();

      this.logger.info('Draft published successfully', 'publishDraft', {
        articleId,
        publishedAt: updatedDocument.publishedAt
      });

      return updatedDocument as SanityPost;
    } catch (error) {
      this.logger.error('Failed to publish draft', error as Error, 'publishDraft', { articleId });
      throw new SanityDocumentError(
        'Failed to publish draft',
        'patch',
        'post',
        articleId,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async unpublish(articleId: string): Promise<SanityPost> {
    const stopTimer = this.logger.startTimer('unpublish');

    try {
      this.logger.info('Unpublishing article', 'unpublish', { articleId });

      const updatedDocument = await this.client
        .patch(articleId)
        .set({
          status: 'draft'
        })
        .unset(['publishedAt'])
        .commit();

      this.logger.info('Article unpublished successfully', 'unpublish', { articleId });

      return updatedDocument as SanityPost;
    } catch (error) {
      this.logger.error('Failed to unpublish article', error as Error, 'unpublish', { articleId });
      throw new SanityDocumentError(
        'Failed to unpublish article',
        'patch',
        'post',
        articleId,
        error as Error
      );
    } finally {
      stopTimer();
    }
  }

  async createArticleWithAssets(
    article: Article,
    images: Image[]
  ): Promise<{
    article: SanityPost;
    uploadedImages: UploadedMedia[];
  }> {
    const stopTimer = this.logger.startTimer('createArticleWithAssets');

    try {
      this.logger.info('Creating article with assets', 'createArticleWithAssets', {
        title: article.title,
        imageCount: images.length
      });

      // 1. 画像を並列アップロード
      let uploadedImages: UploadedMedia[] = [];
      if (images.length > 0) {
        this.logger.debug('Uploading images', 'createArticleWithAssets', {
          imageCount: images.length
        });
        uploadedImages = await this.imageUploader.uploadImages(images);
      }

      // 2. アップロードされた画像を記事に関連付け
      if (uploadedImages.length > 0) {
        // メイン画像の設定
        if (!article.hasMainImage() && uploadedImages.length > 0) {
          const mainImageData = uploadedImages[0];
          const mainImage = Image.fromUploadedMedia(mainImageData);
          article.setMainImage(mainImage);
        }

        // 記事コンテンツ内に画像を挿入
        await this.insertImagesIntoContent(article, uploadedImages);
      }

      // 3. 記事を作成
      const sanityDocument = await this.createArticleDocument(article);

      this.logger.info('Article with assets created successfully', 'createArticleWithAssets', {
        articleId: sanityDocument._id,
        title: article.title,
        uploadedImageCount: uploadedImages.length
      });

      return {
        article: sanityDocument,
        uploadedImages
      };
    } catch (error) {
      this.logger.error('Failed to create article with assets', error as Error, 'createArticleWithAssets');
      throw error;
    } finally {
      stopTimer();
    }
  }

  async validateArticle(article: Article): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const stopTimer = this.logger.startTimer('validateArticle');
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // 必須フィールドの検証
      if (!article.title || article.title.trim().length === 0) {
        errors.push('Title is required');
      }

      if (article.title && article.title.length > 100) {
        warnings.push('Title is longer than recommended (100 characters)');
      }

      if (!article.slug || article.slug.trim().length === 0) {
        errors.push('Slug is required');
      }

      if (!article.category) {
        errors.push('Category is required');
      }

      if (article.content.length === 0) {
        errors.push('Content is required');
      }

      // SEO検証
      if (!article.seo.metaTitle) {
        warnings.push('Meta title is not set');
      }

      if (!article.seo.metaDescription) {
        warnings.push('Meta description is not set');
      }

      if (article.seo.metaTitle && article.seo.metaTitle.length > 60) {
        warnings.push('Meta title is longer than recommended (60 characters)');
      }

      if (article.seo.metaDescription && article.seo.metaDescription.length > 160) {
        warnings.push('Meta description is longer than recommended (160 characters)');
      }

      // タグの検証
      if (article.tags.length === 0) {
        warnings.push('No tags specified');
      }

      if (article.tags.length > 10) {
        warnings.push('Too many tags (recommended: 3-5)');
      }

      // コンテンツの長さ検証
      const wordCount = article.getWordCount();
      if (wordCount < 300) {
        warnings.push('Article is quite short (less than 300 words)');
      }

      // 画像の検証
      if (!article.hasMainImage()) {
        warnings.push('Main image is not set');
      }

      // スラッグの重複チェック
      if (article.slug) {
        const existingArticle = await this.checkSlugExists(article.slug);
        if (existingArticle) {
          errors.push(`Slug "${article.slug}" already exists`);
        }
      }

      const isValid = errors.length === 0;

      this.logger.debug('Article validation completed', 'validateArticle', {
        isValid,
        errorCount: errors.length,
        warningCount: warnings.length
      });

      return { isValid, errors, warnings };
    } catch (error) {
      this.logger.error('Article validation failed', error as Error, 'validateArticle');
      return {
        isValid: false,
        errors: ['Validation failed due to system error'],
        warnings
      };
    } finally {
      stopTimer();
    }
  }

  // プライベートメソッド

  private async createArticleDocument(article: Article): Promise<SanityPost> {
    try {
      const sanityDoc = article.toSanityDocument();
      
      // カテゴリー参照を正しく設定
      sanityDoc.categories = [{
        _type: 'reference',
        _ref: await this.getCategoryReference(article.category)
      }];

      // 著者参照を設定（デフォルト著者）
      sanityDoc.author = {
        _type: 'reference',
        _ref: await this.getDefaultAuthorReference()
      };

      const createdDocument = await this.client.create(sanityDoc);
      
      return createdDocument as SanityPost;
    } catch (error) {
      throw new SanityDocumentError(
        'Failed to create article document',
        'create',
        'post',
        undefined,
        error as Error
      );
    }
  }

  private async insertImagesIntoContent(article: Article, uploadedImages: UploadedMedia[]): Promise<void> {
    // 基本的な実装：最初の段落の後に最初の画像を挿入
    if (uploadedImages.length > 0 && article.content.length > 1) {
      const firstImage = uploadedImages[0];
      const imageBlock = {
        _type: 'image',
        _key: `image_${firstImage.id}`,
        asset: {
          _type: 'reference',
          _ref: firstImage.sanityAssetId
        },
        alt: firstImage.altText || firstImage.fileName,
        caption: firstImage.caption
      };

      // 2番目のブロックの位置に画像を挿入
      article.content.splice(1, 0, imageBlock);
    }
  }

  private async getCategoryReference(category: ArticleCategory): Promise<string> {
    // カテゴリーマッピング
    const categoryMapping: Record<ArticleCategory, string> = {
      [ArticleCategory.AI_UTILIZATION]: 'category-ai-utilization',
      [ArticleCategory.ORGANIZATION_DEVELOPMENT]: 'category-organization-development',
      [ArticleCategory.WELL_BEING]: 'category-well-being'
    };

    const categoryId = categoryMapping[category];
    
    // カテゴリーが存在するかチェック
    try {
      const existingCategory = await this.client.getDocument(categoryId);
      if (existingCategory) {
        return categoryId;
      }
    } catch {
      // カテゴリーが存在しない場合は作成
    }

    // カテゴリーを作成
    const categoryDoc = {
      _id: categoryId,
      _type: 'category',
      title: category,
      slug: {
        _type: 'slug',
        current: this.slugify(category)
      },
      description: `${category}に関する記事`,
      color: this.getCategoryColor(category),
      order: this.getCategoryOrder(category),
      isActive: true
    };

    await this.client.createIfNotExists(categoryDoc);
    return categoryId;
  }

  private async getDefaultAuthorReference(): Promise<string> {
    const authorId = 'author-default';
    
    try {
      const existingAuthor = await this.client.getDocument(authorId);
      if (existingAuthor) {
        return authorId;
      }
    } catch {
      // 著者が存在しない場合は作成
    }

    // デフォルト著者を作成
    const authorDoc = {
      _id: authorId,
      _type: 'author',
      name: 'ブログ管理者',
      slug: {
        _type: 'slug',
        current: 'blog-admin'
      },
      bio: 'ブログの管理・運営を行っています。',
      isActive: true
    };

    await this.client.createIfNotExists(authorDoc);
    return authorId;
  }

  private async checkSlugExists(slug: string): Promise<boolean> {
    try {
      const query = '*[_type == "post" && slug.current == $slug][0]';
      const existingPost = await this.client.fetch(query, { slug });
      return !!existingPost;
    } catch {
      return false;
    }
  }

  private getCategoryColor(category: ArticleCategory): string {
    const colorMapping: Record<ArticleCategory, string> = {
      [ArticleCategory.AI_UTILIZATION]: 'blue',
      [ArticleCategory.ORGANIZATION_DEVELOPMENT]: 'green',
      [ArticleCategory.WELL_BEING]: 'purple'
    };
    return colorMapping[category] || 'gray';
  }

  private getCategoryOrder(category: ArticleCategory): number {
    const orderMapping: Record<ArticleCategory, number> = {
      [ArticleCategory.AI_UTILIZATION]: 1,
      [ArticleCategory.ORGANIZATION_DEVELOPMENT]: 2,
      [ArticleCategory.WELL_BEING]: 3
    };
    return orderMapping[category] || 99;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 特殊文字を削除
      .replace(/\s+/g, '-') // スペースをハイフンに
      .replace(/-+/g, '-') // 連続するハイフンを1つに
      .trim();
  }

  private validateConfig(): void {
    if (!this.config.projectId) {
      throw new SanityConfigurationError('Sanity project ID is required', 'projectId');
    }
    if (!this.config.token) {
      throw new SanityConfigurationError('Sanity token is required', 'token');
    }
    if (!this.config.dataset) {
      throw new SanityConfigurationError('Sanity dataset is required', 'dataset');
    }
  }
}

/**
 * ファクトリー関数
 */
export function createSanityArticlePublisher(config: SanityConfig, logger?: Logger): SanityArticlePublisher {
  return new SanityArticlePublisher(config, logger);
}