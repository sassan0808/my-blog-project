import React from 'react'

interface TagListProps {
  tags: string[]
  className?: string
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'outline'
}

export const TagList: React.FC<TagListProps> = ({ 
  tags, 
  className = '', 
  size = 'medium',
  variant = 'default'
}) => {
  if (!tags || tags.length === 0) return null

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  }

  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`
            inline-flex items-center rounded-full font-medium
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            transition-colors duration-200
            hover:opacity-80
          `}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}