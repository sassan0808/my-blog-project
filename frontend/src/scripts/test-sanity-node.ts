import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testSanityConnection() {
  console.log('=== Testing Sanity Connection (Node.js) ===')
  
  console.log('\n1. Checking environment variables...')
  console.log('VITE_SANITY_PROJECT_ID:', process.env.VITE_SANITY_PROJECT_ID)
  console.log('VITE_SANITY_DATASET:', process.env.VITE_SANITY_DATASET)
  console.log('VITE_SANITY_API_VERSION:', process.env.VITE_SANITY_API_VERSION)
  console.log('VITE_SANITY_TOKEN:', process.env.VITE_SANITY_TOKEN ? '[REDACTED]' : 'undefined')

  const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || 'qcfwoevq',
    dataset: process.env.VITE_SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-01-01',
    token: process.env.VITE_SANITY_TOKEN,
  })

  console.log('\n2. Testing direct Sanity client...')
  try {
    const directQuery = `*[_type == "post"][0..2] {
      _id,
      title,
      slug,
      publishedAt
    }`
    const directResult = await client.fetch(directQuery)
    console.log('✅ Direct Sanity query successful:')
    console.log(JSON.stringify(directResult, null, 2))
  } catch (error) {
    console.error('❌ Direct Sanity query failed:', error)
  }

  console.log('\n3. Testing categories query...')
  try {
    const categoriesQuery = `*[_type == "category"] | order(title asc) {
      _id,
      title,
      description
    }`
    const categoriesResult = await client.fetch(categoriesQuery)
    console.log('✅ Categories query successful:')
    console.log(JSON.stringify(categoriesResult, null, 2))
  } catch (error) {
    console.error('❌ Categories query failed:', error)
  }

  console.log('\n4. Testing posts with categories...')
  try {
    const postsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      publishedAt,
      "categories": categories[]->{
        _id,
        title,
        description
      }
    }`
    const postsResult = await client.fetch(postsQuery)
    console.log('✅ Posts with categories query successful:')
    console.log(JSON.stringify(postsResult, null, 2))
  } catch (error) {
    console.error('❌ Posts with categories query failed:', error)
  }
}

testSanityConnection()