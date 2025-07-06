/**
 * Debug script to test Sanity connection and identify potential issues
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function debugSanity() {
  console.log('=== Sanity Debug Report ===\n')
  
  // 1. Environment Check
  console.log('1. Environment Variables:')
  console.log('   PROJECT_ID:', process.env.VITE_SANITY_PROJECT_ID)
  console.log('   DATASET:', process.env.VITE_SANITY_DATASET)
  console.log('   API_VERSION:', process.env.VITE_SANITY_API_VERSION)
  console.log('   TOKEN:', process.env.VITE_SANITY_TOKEN ? '[PRESENT]' : '[MISSING]')
  console.log('')

  // 2. Create client
  const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
    token: process.env.VITE_SANITY_TOKEN,
  })

  // 3. Test basic connectivity
  console.log('2. Testing Basic Connectivity...')
  try {
    const healthCheck = await client.fetch('*[_type == "post"][0]')
    console.log('   ✅ Connection successful')
    console.log('   Sample post:', healthCheck?._id || 'No posts found')
  } catch (error) {
    console.log('   ❌ Connection failed:', (error as Error).message)
    return
  }

  // 4. Test post query with filters
  console.log('\n3. Testing Post Query with Filters...')
  try {
    const postsQuery = `*[_type == "post" && defined(slug.current) && slug.current != ""] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "categories": categories[]->{
        _id,
        title
      }
    }`
    const posts = await client.fetch(postsQuery)
    console.log(`   ✅ Found ${posts.length} valid posts`)
    
    posts.forEach((post: { _id: string; title: string; slug?: { current: string }; publishedAt?: string; categories?: { _id: string; title: string }[] }, index: number) => {
      console.log(`   Post ${index + 1}:`)
      console.log(`     Title: ${post.title}`)
      console.log(`     Slug: ${post.slug?.current || 'EMPTY'}`)
      console.log(`     Published: ${post.publishedAt || 'UNPUBLISHED'}`)
      console.log(`     Categories: ${post.categories?.length || 0}`)
    })
  } catch (error) {
    console.log('   ❌ Post query failed:', (error as Error).message)
  }

  // 5. Test categories
  console.log('\n4. Testing Categories...')
  try {
    const categoriesQuery = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      description
    }`
    const categories = await client.fetch(categoriesQuery)
    console.log(`   ✅ Found ${categories.length} categories`)
    
    categories.forEach((cat: { _id: string; title: string }) => {
      console.log(`     - ${cat.title} (${cat._id})`)
    })
  } catch (error) {
    console.log('   ❌ Categories query failed:', (error as Error).message)
  }

  // 6. Test problematic posts
  console.log('\n5. Checking for Problematic Posts...')
  try {
    const problemQuery = `*[_type == "post"] {
      _id,
      title,
      slug,
      publishedAt,
      "hasSlug": defined(slug.current),
      "emptySlug": slug.current == "",
      "hasPublishDate": defined(publishedAt)
    }`
    const allPosts = await client.fetch(problemQuery)
    console.log(`   Total posts in database: ${allPosts.length}`)
    
    const noSlug = allPosts.filter((p: { hasSlug: boolean }) => !p.hasSlug)
    const emptySlug = allPosts.filter((p: { emptySlug: boolean }) => p.emptySlug)
    const unpublished = allPosts.filter((p: { hasPublishDate: boolean }) => !p.hasPublishDate)
    
    console.log(`   Posts without slug: ${noSlug.length}`)
    console.log(`   Posts with empty slug: ${emptySlug.length}`)
    console.log(`   Unpublished posts: ${unpublished.length}`)
    
    if (emptySlug.length > 0) {
      console.log('\n   Posts with empty slugs:')
      emptySlug.forEach((post: { _id: string; title: string }) => {
        console.log(`     - ${post.title} (${post._id})`)
      })
    }
  } catch (error) {
    console.log('   ❌ Problem check failed:', (error as Error).message)
  }

  console.log('\n=== Debug Complete ===')
}

debugSanity().catch(console.error)