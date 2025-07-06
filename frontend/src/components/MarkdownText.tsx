/**
 * PortableText内のMarkdown記法を適切にレンダリングするコンポーネント
 */
import React, { useMemo } from 'react'

interface MarkdownTextProps {
  children: React.ReactNode
  className?: string
}

const MarkdownText = React.memo(function MarkdownText({ children, className = "" }: MarkdownTextProps) {
  // childrenを文字列として取得
  const text = React.Children.toArray(children).join('')
  
  // Markdownパターンの検出と処理（メモ化）
  const processedContent = useMemo(() => {
    const processMarkdown = (text: string): React.ReactNode => {
    // 見出しの検出 (##, ###)
    if (text.startsWith('### ')) {
      return (
        <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">
          {text.slice(4)}
        </h3>
      )
    }
    
    if (text.startsWith('## ')) {
      return (
        <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
          {text.slice(3)}
        </h2>
      )
    }
    
    if (text.startsWith('# ')) {
      return (
        <h1 className="text-3xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
          {text.slice(2)}
        </h1>
      )
    }
    
    // 太字の処理 (**text**)
    const boldPattern = /\*\*(.*?)\*\*/g
    const parts = text.split(boldPattern)
    
    if (parts.length > 1) {
      return (
        <p className={`mb-4 text-gray-800 dark:text-gray-200 ${className}`}>
          {parts.map((part, index) => 
            index % 2 === 1 ? (
              <strong key={index} className="font-bold text-gray-900 dark:text-white">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      )
    }
    
    // リストの検出 (- item)
    if (text.startsWith('- ') || text.includes('\n- ')) {
      const lines = text.split('\n')
      const listItems = lines.filter(line => line.startsWith('- '))
      const nonListLines = lines.filter(line => !line.startsWith('- '))
      
      return (
        <div>
          {nonListLines.length > 0 && (
            <p className={`mb-2 text-gray-800 dark:text-gray-200 ${className}`}>
              {nonListLines.join('\n')}
            </p>
          )}
          {listItems.length > 0 && (
            <ul className="list-disc list-inside mb-4 space-y-1">
              {listItems.map((item, index) => (
                <li key={index} className="text-gray-800 dark:text-gray-200">
                  {item.slice(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }
    
    // 改行の処理
    if (text.includes('\n')) {
      return (
        <div className="mb-4">
          {text.split('\n').map((line, index) => (
            <p key={index} className={`text-gray-800 dark:text-gray-200 ${className} ${index > 0 ? 'mt-2' : ''}`}>
              {line}
            </p>
          ))}
        </div>
      )
    }
    
    // 通常のテキスト
    return (
      <p className={`mb-4 text-gray-800 dark:text-gray-200 ${className}`}>
        {text}
      </p>
    )
    }
    
    return processMarkdown(text)
  }, [text, className])
  
  return <>{processedContent}</>
})

export default MarkdownText