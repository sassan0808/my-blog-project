import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  style?: React.CSSProperties
}

export default function Card({ children, className = '', hover = false, glass = false, style }: CardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300"
  const hoverClasses = hover ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : ""
  const glassClasses = glass 
    ? "bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border-white/20 dark:border-gray-700/20" 
    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm"

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${glassClasses} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}