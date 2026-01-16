import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: 実際の送信処理（Netlify Forms, Vercel Forms, または自作API）
    await new Promise(resolve => setTimeout(resolve, 2000)) // デモ用の遅延

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12 bg-brand-slate-50 dark:bg-brand-navy-900 flex items-center justify-center">
        <Card className="p-12 text-center max-w-2xl mx-4 bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
            メッセージを送信しました！
          </h1>
          <p className="text-lg text-brand-slate-600 dark:text-brand-slate-300 mb-8 font-inter">
            お問い合わせありがとうございます。
            <br />
            通常24時間以内にご返信いたします。
          </p>
          <Button
            variant="gradient"
            className="bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 font-montserrat font-semibold"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: '', email: '', subject: '', message: '' })
            }}
          >
            新しいメッセージを送信
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-brand-slate-50 dark:bg-brand-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 mt-12">
          <h1 className="text-5xl font-playfair font-bold mb-6 text-brand-navy-900 dark:text-white">
            Contact
          </h1>
          <div className="w-20 h-1 bg-brand-gold-500 mx-auto mb-8"></div>
          <p className="text-xl text-brand-slate-600 dark:text-brand-slate-300 max-w-2xl mx-auto font-inter leading-relaxed">
            プロジェクトのご相談、技術についての質問、
            または単純にこんにちはと言いたい場合でも、
            お気軽にご連絡ください。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700">
              <h3 className="text-xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
                📧 メール
              </h3>
              <p className="text-brand-slate-600 dark:text-brand-slate-300 mb-2 font-inter">
                お仕事のご依頼やご質問はこちら
              </p>
              <a
                href="mailto:contact@example.com"
                className="text-brand-gold-600 dark:text-brand-gold-400 hover:underline font-montserrat font-medium"
              >
                contact@example.com
              </a>
            </Card>

            <Card className="p-6 bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700">
              <h3 className="text-xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
                💬 SNS
              </h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/sasaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-brand-slate-700 dark:text-brand-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors font-inter"
                >
                  <span>🔗</span>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/sasaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-brand-slate-700 dark:text-brand-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors font-inter"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/sasaki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-brand-slate-700 dark:text-brand-slate-300 hover:text-brand-gold-600 dark:hover:text-brand-gold-400 transition-colors font-inter"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700">
              <h3 className="text-xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-4">
                ⚡ レスポンス時間
              </h3>
              <p className="text-brand-slate-600 dark:text-brand-slate-300 font-inter">
                通常24時間以内にご返信いたします。
                緊急の場合は、SNSでのDMも
                ご利用ください。
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white dark:bg-brand-navy-800 border-brand-slate-200 dark:border-brand-navy-700">
              <h2 className="text-2xl font-playfair font-bold text-brand-navy-900 dark:text-white mb-6">
                メッセージを送信
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-montserrat font-medium text-brand-slate-700 dark:text-brand-slate-300 mb-2">
                      お名前 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-slate-300 dark:border-brand-navy-600 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent bg-white dark:bg-brand-navy-700 text-brand-navy-900 dark:text-white transition-colors font-inter"
                      placeholder="山田太郎"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-montserrat font-medium text-brand-slate-700 dark:text-brand-slate-300 mb-2">
                      メールアドレス *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-slate-300 dark:border-brand-navy-600 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent bg-white dark:bg-brand-navy-700 text-brand-navy-900 dark:text-white transition-colors font-inter"
                      placeholder="yamada@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-montserrat font-medium text-brand-slate-700 dark:text-brand-slate-300 mb-2">
                    件名 *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-slate-300 dark:border-brand-navy-600 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent bg-white dark:bg-brand-navy-700 text-brand-navy-900 dark:text-white transition-colors font-inter"
                    placeholder="プロジェクトのご相談"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-montserrat font-medium text-brand-slate-700 dark:text-brand-slate-300 mb-2">
                    メッセージ *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-slate-300 dark:border-brand-navy-600 rounded-lg focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent bg-white dark:bg-brand-navy-700 text-brand-navy-900 dark:text-white transition-colors resize-none font-inter"
                    placeholder="プロジェクトの詳細、予算、スケジュールなどをお聞かせください。"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full bg-brand-navy-900 dark:bg-white text-white dark:text-brand-navy-900 hover:bg-brand-navy-800 dark:hover:bg-brand-slate-100 font-montserrat font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white dark:text-brand-navy-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      送信中...
                    </>
                  ) : (
                    'メッセージを送信'
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
