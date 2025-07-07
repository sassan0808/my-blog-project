import { Image } from './image';
import { ImagePlacement } from './media.interface';

/**
 * 記事のステータス
 */
export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * 記事のカテゴリー
 */
export enum ArticleCategory {
  AI_UTILIZATION = 'AI活用',
  ORGANIZATION_DEVELOPMENT = '組織開発',
  WELL_BEING = 'Well-being'
}

/**
 * PortableTextブロック
 */
export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: PortableTextMarkDef[];
  level?: number;
}

/**
 * PortableTextスパン
 */
export interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks?: string[];
}

/**
 * PortableTextマーク定義
 */
export interface PortableTextMarkDef {
  _type: string;
  _key: string;
  href?: string;
}

/**
 * 画像ブロック
 */
export interface ImageBlock extends PortableTextBlock {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt: string;
  caption?: string;
  placement?: ImagePlacement;
}

/**
 * 記事のメタデータ
 */
export interface ArticleMetadata {
  wordCount: number;
  readingTime: number; // 分
  imageCount: number;
  headingCount: number;
  lastModified: Date;
  author?: string;
  seoScore?: number;
}

/**
 * SEO設定
 */
export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  canonicalUrl?: string;
  socialImage?: string;
}

/**
 * 記事エンティティ
 */
export class Article {
  public readonly id: string;
  public title: string;
  public slug: string;
  public excerpt: string;
  public content: PortableTextBlock[];
  public status: ArticleStatus;
  public category: ArticleCategory;
  public tags: string[];
  public images: Image[];
  public mainImage?: Image;
  public seo: SEOSettings;
  public metadata: ArticleMetadata;
  public publishedAt?: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id?: string;
    title: string;
    slug?: string;
    excerpt?: string;
    content?: PortableTextBlock[];
    status?: ArticleStatus;
    category: ArticleCategory;
    tags?: string[];
    images?: Image[];
    mainImage?: Image;
    seo?: Partial<SEOSettings>;
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id || Article.generateId();
    this.title = params.title;
    this.slug = params.slug || Article.generateSlug(params.title);
    this.excerpt = params.excerpt || '';
    this.content = params.content || [];
    this.status = params.status || ArticleStatus.DRAFT;
    this.category = params.category;
    this.tags = params.tags || [];
    this.images = params.images || [];
    this.mainImage = params.mainImage;
    this.seo = {
      metaTitle: params.seo?.metaTitle || params.title,
      metaDescription: params.seo?.metaDescription || params.excerpt || '',
      noIndex: params.seo?.noIndex || false,
      canonicalUrl: params.seo?.canonicalUrl,
      socialImage: params.seo?.socialImage
    };
    this.publishedAt = params.publishedAt;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.metadata = this.calculateMetadata();
  }

  /**
   * Markdownテキストから記事を作成
   */
  static fromMarkdown(markdown: string, category: ArticleCategory, options?: {
    title?: string;
    tags?: string[];
    images?: Image[];
    seo?: Partial<SEOSettings>;
  }): Article {
    const { title, content, excerpt } = Article.parseMarkdown(markdown);
    
    return new Article({
      title: options?.title || title,
      excerpt,
      content: Article.markdownToPortableText(content),
      category,
      tags: options?.tags,
      images: options?.images,
      seo: options?.seo
    });
  }

  /**
   * 記事に画像を追加
   */
  addImage(image: Image): void {
    if (!this.images.find(img => img.id === image.id)) {
      this.images.push(image);
      this.updateMetadata();
    }
  }

  /**
   * 記事から画像を削除
   */
  removeImage(imageId: string): void {
    this.images = this.images.filter(img => img.id !== imageId);
    if (this.mainImage?.id === imageId) {
      this.mainImage = undefined;
    }
    this.updateMetadata();
  }

  /**
   * メイン画像を設定
   */
  setMainImage(image: Image): void {
    this.mainImage = image;
    this.addImage(image);
  }

  /**
   * コンテンツに画像を挿入
   */
  insertImageInContent(image: Image, position: number, _placement: ImagePlacement = ImagePlacement.FIGURE): void {
    const imageBlock: ImageBlock = {
      _type: 'image',
      _key: `image_${image.id}`,
      asset: {
        _ref: image.id,
        _type: 'reference'
      },
      alt: image.getAltText(),
      caption: image.caption,
      placement: _placement
    };

    this.content.splice(position, 0, imageBlock);
    this.addImage(image);
  }

  /**
   * 記事を公開
   */
  publish(): void {
    this.status = ArticleStatus.PUBLISHED;
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * 記事をアーカイブ
   */
  archive(): void {
    this.status = ArticleStatus.ARCHIVED;
    this.updatedAt = new Date();
  }

  /**
   * 記事をドラフトに戻す
   */
  unpublish(): void {
    this.status = ArticleStatus.DRAFT;
    this.publishedAt = undefined;
    this.updatedAt = new Date();
  }

  /**
   * SEO設定を更新
   */
  updateSEO(seo: Partial<SEOSettings>): void {
    this.seo = { ...this.seo, ...seo };
    this.updatedAt = new Date();
  }

  /**
   * タグを追加
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  /**
   * タグを削除
   */
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  /**
   * 公開済みかどうか
   */
  isPublished(): boolean {
    return this.status === ArticleStatus.PUBLISHED;
  }

  /**
   * ドラフトかどうか
   */
  isDraft(): boolean {
    return this.status === ArticleStatus.DRAFT;
  }

  /**
   * アーカイブ済みかどうか
   */
  isArchived(): boolean {
    return this.status === ArticleStatus.ARCHIVED;
  }

  /**
   * 画像が含まれているかどうか
   */
  hasImages(): boolean {
    return this.images.length > 0;
  }

  /**
   * メイン画像が設定されているかどうか
   */
  hasMainImage(): boolean {
    return this.mainImage !== undefined;
  }

  /**
   * 読了時間を分で取得
   */
  getReadingTime(): number {
    return this.metadata.readingTime;
  }

  /**
   * 文字数を取得
   */
  getWordCount(): number {
    return this.metadata.wordCount;
  }

  /**
   * URL フレンドリーなスラッグを取得
   */
  getUrl(): string {
    return `/${this.slug}`;
  }

  /**
   * ソーシャルメディア用の画像URLを取得
   */
  getSocialImageUrl(): string | undefined {
    return this.seo.socialImage || this.mainImage?.url;
  }

  /**
   * 記事の完成度を計算（0-100%）
   */
  getCompleteness(): number {
    let score = 0;
    const maxScore = 100;

    // 基本情報
    if (this.title) score += 10;
    if (this.excerpt) score += 10;
    if (this.content.length > 0) score += 20;
    if (this.category) score += 10;

    // SEO
    if (this.seo.metaTitle) score += 10;
    if (this.seo.metaDescription) score += 10;

    // コンテンツの充実度
    if (this.metadata.wordCount > 500) score += 10;
    if (this.metadata.wordCount > 1500) score += 5;
    if (this.hasMainImage()) score += 10;
    if (this.tags.length >= 3) score += 5;

    return Math.min(score, maxScore);
  }

  /**
   * JSON形式で出力
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      excerpt: this.excerpt,
      content: this.content,
      status: this.status,
      category: this.category,
      tags: this.tags,
      images: this.images.map(img => img.toJSON()),
      mainImage: this.mainImage?.toJSON(),
      seo: this.seo,
      metadata: this.metadata,
      publishedAt: this.publishedAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      completeness: this.getCompleteness()
    };
  }

  /**
   * Sanity用のドキュメント形式で出力
   */
  toSanityDocument(): Record<string, unknown> {
    return {
      _type: 'post',
      _id: this.id,
      title: this.title,
      slug: {
        _type: 'slug',
        current: this.slug
      },
      excerpt: this.excerpt,
      body: this.content,
      status: this.status,
      categories: [{
        _type: 'reference',
        _ref: this.getCategoryId()
      }],
      tags: this.tags,
      mainImage: this.mainImage ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: this.mainImage.id
        },
        alt: this.mainImage.getAltText()
      } : undefined,
      metaTitle: this.seo.metaTitle,
      metaDescription: this.seo.metaDescription,
      noIndex: this.seo.noIndex,
      publishedAt: this.publishedAt?.toISOString(),
      author: {
        _type: 'reference',
        _ref: 'author-1' // デフォルト著者
      }
    };
  }

  /**
   * メタデータを計算
   */
  private calculateMetadata(): ArticleMetadata {
    const textContent = this.extractTextContent();
    const wordCount = this.countWords(textContent);
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200語/分
    
    return {
      wordCount,
      readingTime,
      imageCount: this.images.length,
      headingCount: this.countHeadings(),
      lastModified: this.updatedAt,
      author: this.metadata?.author
    };
  }

  /**
   * メタデータを更新
   */
  private updateMetadata(): void {
    this.metadata = this.calculateMetadata();
    this.updatedAt = new Date();
  }

  /**
   * テキストコンテンツを抽出
   */
  private extractTextContent(): string {
    return this.content
      .filter(block => block._type === 'block')
      .map(block => block.children?.map(child => child.text).join('') || '')
      .join(' ');
  }

  /**
   * 単語数をカウント
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * 見出し数をカウント
   */
  private countHeadings(): number {
    return this.content.filter(block => 
      block.style && block.style.startsWith('h')
    ).length;
  }

  /**
   * カテゴリーIDを取得
   */
  private getCategoryId(): string {
    switch (this.category) {
      case ArticleCategory.AI_UTILIZATION:
        return 'category-ai-utilization';
      case ArticleCategory.ORGANIZATION_DEVELOPMENT:
        return 'category-organization-development';
      case ArticleCategory.WELL_BEING:
        return 'category-well-being';
      default:
        return 'category-other';
    }
  }

  /**
   * 一意なIDを生成
   */
  private static generateId(): string {
    return `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * タイトルからスラッグを生成
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 特殊文字を削除
      .replace(/\s+/g, '-') // スペースをハイフンに
      .replace(/-+/g, '-') // 連続するハイフンを1つに
      .trim();
  }

  /**
   * Markdownテキストをパース
   */
  private static parseMarkdown(markdown: string): { title: string; content: string; excerpt: string } {
    const lines = markdown.split('\n');
    let title = '';
    let content = '';
    let excerpt = '';

    // タイトルを抽出（最初の# 見出し）
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        break;
      }
    }

    content = markdown;

    // 抜粋を生成（最初の段落から150文字）
    const paragraphs = markdown.split('\n\n');
    for (const paragraph of paragraphs) {
      if (paragraph.trim() && !paragraph.startsWith('#')) {
        excerpt = paragraph.substring(0, 150) + (paragraph.length > 150 ? '...' : '');
        break;
      }
    }

    return { title, content, excerpt };
  }

  /**
   * MarkdownをPortableTextに変換（基本版）
   */
  private static markdownToPortableText(markdown: string): PortableTextBlock[] {
    const blocks: PortableTextBlock[] = [];
    const lines = markdown.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h1',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(2) }]
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h2',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(3) }]
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'h3',
          children: [{ _type: 'span', _key: `span_${i}`, text: line.substring(4) }]
        });
      } else if (line.trim()) {
        blocks.push({
          _type: 'block',
          _key: `block_${i}`,
          style: 'normal',
          children: [{ _type: 'span', _key: `span_${i}`, text: line }]
        });
      }
    }

    return blocks;
  }
}

/**
 * 記事作成用のビルダークラス
 */
export class ArticleBuilder {
  private article: Partial<{
    title: string;
    category: ArticleCategory;
    excerpt: string;
    content: PortableTextBlock[];
    tags: string[];
    images: Image[];
    mainImage: Image;
    seo: Partial<SEOSettings>;
  }> = {};

  setTitle(title: string): ArticleBuilder {
    this.article.title = title;
    return this;
  }

  setCategory(category: ArticleCategory): ArticleBuilder {
    this.article.category = category;
    return this;
  }

  setExcerpt(excerpt: string): ArticleBuilder {
    this.article.excerpt = excerpt;
    return this;
  }

  setContent(content: PortableTextBlock[]): ArticleBuilder {
    this.article.content = content;
    return this;
  }

  addTag(tag: string): ArticleBuilder {
    if (!this.article.tags) this.article.tags = [];
    this.article.tags.push(tag);
    return this;
  }

  addImage(image: Image): ArticleBuilder {
    if (!this.article.images) this.article.images = [];
    this.article.images.push(image);
    return this;
  }

  setMainImage(image: Image): ArticleBuilder {
    this.article.mainImage = image;
    return this;
  }

  setSEO(seo: Partial<SEOSettings>): ArticleBuilder {
    this.article.seo = { ...this.article.seo, ...seo };
    return this;
  }

  build(): Article {
    if (!this.article.title || !this.article.category) {
      throw new Error('Title and category are required');
    }

    return new Article({
      title: this.article.title,
      category: this.article.category,
      excerpt: this.article.excerpt,
      content: this.article.content,
      tags: this.article.tags,
      images: this.article.images,
      mainImage: this.article.mainImage,
      seo: this.article.seo
    });
  }
}