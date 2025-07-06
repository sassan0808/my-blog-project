import { client } from '../lib/sanity'
import { DataService } from '../lib/data'

async function testSanityConnection() {
  console.log('=== Testing Sanity Connection ===')
  
  console.log('1. Testing direct Sanity client...')
  try {
    const directQuery = `*[_type == "post"][0..2] {
      _id,
      title,
      slug,
      publishedAt
    }`
    const directResult = await client.fetch(directQuery)
    console.log('✅ Direct Sanity query successful:', directResult)
  } catch (error) {
    console.error('❌ Direct Sanity query failed:', error)
  }

  console.log('\n2. Testing DataService.getBlogPosts()...')
  try {
    const posts = await DataService.getBlogPosts()
    console.log('✅ DataService.getBlogPosts() successful:', posts)
  } catch (error) {
    console.error('❌ DataService.getBlogPosts() failed:', error)
  }

  console.log('\n3. Testing DataService.getCategories()...')
  try {
    const categories = await DataService.getCategories()
    console.log('✅ DataService.getCategories() successful:', categories)
  } catch (error) {
    console.error('❌ DataService.getCategories() failed:', error)
  }

  console.log('\n4. Checking environment variables...')
  console.log('VITE_SANITY_PROJECT_ID:', import.meta.env.VITE_SANITY_PROJECT_ID)
  console.log('VITE_SANITY_DATASET:', import.meta.env.VITE_SANITY_DATASET)
  console.log('VITE_SANITY_API_VERSION:', import.meta.env.VITE_SANITY_API_VERSION)
  console.log('VITE_SANITY_TOKEN:', import.meta.env.VITE_SANITY_TOKEN ? '[REDACTED]' : 'undefined')
}

testSanityConnection()