import {defineField, defineType} from 'sanity'
import {createUniqueSlug, validateSlug} from '../lib/slugify'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: '📝 コンテンツ',
      default: true,
    },
    {
      name: 'meta',
      title: '⚙️ メタデータ',
    },
    {
      name: 'seo',
      title: '🔍 SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().min(5).max(100).error('タイトルは5〜100文字で入力してください'),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（URL用）',
      type: 'slug',
      group: 'meta',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => createUniqueSlug(input),
        isUnique: () => true, // 常にタイムスタンプで一意性保証
      },
      validation: (Rule) => 
        Rule.required()
          .custom((slug) => {
            if (!slug?.current) return 'スラッグは必須です'
            const validation = validateSlug(slug.current)
            return validation.isValid ? true : validation.errors[0]
          }),
    }),
    defineField({
      name: 'excerpt',
      title: '抜粋',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('抜粋は200文字以内を推奨します'),
      description: 'ブログリストに表示される要約文です',
    }),
    defineField({
      name: 'status',
      title: 'ステータス',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          {title: '下書き', value: 'draft'},
          {title: '公開', value: 'published'},
          {title: 'アーカイブ', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: '著者',
      type: 'reference',
      group: 'meta',
      to: {type: 'author'},
      validation: (Rule) => Rule.required().error('著者の選択は必須です'),
    }),
    defineField({
      name: 'categories',
      title: 'カテゴリー',
      type: 'array',
      group: 'meta',
      of: [{type: 'reference', to: {type: 'category'}}],
      validation: (Rule) => Rule.min(1).error('最低1つのカテゴリーを選択してください'),
    }),
    defineField({
      name: 'tags',
      title: 'タグ',
      type: 'array',
      group: 'meta',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'メインイメージ',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text（アクセシビリティ用）',
          validation: (Rule) => Rule.required().error('画像には必ずAltテキストを設定してください'),
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: '公開日時',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error('公開日時は必須です'),
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required().error('本文は必須です'),
    }),
    // SEO関連フィールド
    defineField({
      name: 'metaTitle',
      title: 'SEOタイトル',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60).warning('SEOタイトルは60文字以内を推奨します'),
      description: '検索結果に表示されるタイトル（空の場合は記事タイトルを使用）',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO説明文',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('SEO説明文は160文字以内を推奨します'),
      description: '検索結果に表示される説明文',
    }),
    defineField({
      name: 'noIndex',
      title: '検索エンジンからの除外',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description: 'チェックすると検索エンジンにインデックスされません',
    }),
  ],
  orderings: [
    {
      title: '公開日時（新しい順）',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: '公開日時（古い順）',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'タイトル（あいうえお順）',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {author, status, publishedAt} = selection
      const statusEmoji = {
        draft: '📝',
        published: '✅',
        archived: '📦',
      }[status] || '❓'
      
      const subtitle = [
        statusEmoji,
        status === 'published' ? '公開済み' : status === 'draft' ? '下書き' : 'アーカイブ',
        author && `by ${author}`,
        publishedAt && new Date(publishedAt).toLocaleDateString('ja-JP'),
      ].filter(Boolean).join(' • ')
      
      return {...selection, subtitle}
    },
  },
})
