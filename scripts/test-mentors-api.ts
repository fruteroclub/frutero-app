/**
 * Test script to call the mentors API and see what's returned
 */

async function testMentorsAPI() {
  console.log('🧪 Testing mentors API...\n')

  try {
    const response = await fetch('http://localhost:3000/api/jam/mentors')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.json()
    console.log('\n📊 Response Data:')
    console.log('Type:', typeof data)
    console.log('Is Array:', Array.isArray(data))

    if (Array.isArray(data)) {
      console.log('Length:', data.length)
      console.log('\nFirst mentor:')
      console.log(JSON.stringify(data[0], null, 2))
    } else if (data.error) {
      console.log('\n❌ Error in response:', data.error)
    } else {
      console.log('\nFull response:')
      console.log(JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('❌ Error calling API:', error)
  }
}

testMentorsAPI()
