import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  url?: string
}

export default function SEOHead({ title, description, ogImage, url }: SEOHeadProps) {
  useEffect(() => {
    document.title = title

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || '')
    } else if (description) {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = title
      document.head.appendChild(meta)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description)
    } else if (description) {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:description')
      meta.content = description
      document.head.appendChild(meta)
    }

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && url) {
      ogUrl.setAttribute('content', url)
    } else if (url) {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:url')
      meta.content = url
      document.head.appendChild(meta)
    }

    const ogImageMeta = document.querySelector('meta[property="og:image"]')
    if (ogImageMeta && ogImage) {
      ogImageMeta.setAttribute('content', ogImage)
    } else if (ogImage) {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:image')
      meta.content = ogImage
      document.head.appendChild(meta)
    }
  }, [title, description, ogImage, url])

  return null
}