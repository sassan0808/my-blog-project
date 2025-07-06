import {defineField, defineType} from 'sanity'
import {createSlug} from '../lib/slugify'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'カテゴリー名',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(30).error('カテゴリー名は2〜30文字で入力してください'),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ（URL用）',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 50,
        slugify: (input: string) => createSlug(input),
      },
      validation: (Rule) => Rule.required().error('スラッグは必須です'),
    }),
    defineField({
      name: 'description',
      title: '説明',
      type: 'text',
      validation: (Rule) => Rule.max(200).warning('説明は200文字以内を推奨します'),
    }),
    defineField({
      name: 'color',
      title: 'カテゴリーカラー',
      type: 'string',
      options: {
        list: [
          {title: '🔵 ブルー（AI活用）', value: 'blue'},
          {title: '🟢 グリーン（組織変革）', value: 'green'},
          {title: '🟣 パープル（Well-being）', value: 'purple'},
          {title: '🟠 オレンジ（技術）', value: 'orange'},
          {title: '🔴 レッド（重要）', value: 'red'},
          {title: '🟡 イエロー（その他）', value: 'yellow'},
        ],
        layout: 'radio',
      },
      initialValue: 'blue',
    }),
    defineField({
      name: 'order',
      title: '表示順序',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'アクティブ',
      type: 'boolean',
      description: 'チェックを外すとフロントエンドで非表示になります',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: '表示順序',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'カテゴリー名（あいうえお順）',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      color: 'color',
      isActive: 'isActive',
    },
    prepare(selection) {
      const {title, description, color, isActive} = selection
      const colorEmoji = {
        blue: '🔵',
        green: '🟢',
        purple: '🟣',
        orange: '🟠',
        red: '🔴',
        yellow: '🟡',
      }[color] || '⚪'
      
      const statusEmoji = isActive ? '✅' : '❌'
      
      return {
        title: `${colorEmoji} ${title}`,
        subtitle: `${statusEmoji} ${isActive ? 'アクティブ' : '非アクティブ'} • ${description || '説明なし'}`,
      }
    },
  },
})
