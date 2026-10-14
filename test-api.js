import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), '')

const API_KEY = env.VITE_PUNTERSEDGE_API_KEY
const BASE_URL = env.VITE_PUNTERSEDGE_BASE_URL || 'https://api.puntersedge.online/v1'

async function test() {
  // Search for Fairmount Park
  const url = new URL(`${BASE_URL}/racing/next-to-go`)
  url.searchParams.set('num_races', '50')
  url.searchParams.set('country', 'US')
  url.searchParams.set('category', 'horse')
  
  const response = await fetch(url, {
    headers: { 'X-API-Key': API_KEY, 'Accept': 'application/json' }
  })
  
  const data = await response.json()
  const fairmount = data.filter(r => r.venue?.toLowerCase().includes('fairmount'))
  console.log('Fairmount races:', fairmount.length)
  fairmount.forEach(r => console.log(`Race ${r.race_number}: ${r.venue} at ${new Date(r.start_time).toLocaleTimeString()}`))
  
  // Also check US races
  const usRaces = data.filter(r => r.country === 'US')
  console.log('\nUS races:', usRaces.length)
  usRaces.slice(0, 10).forEach(r => console.log(`Race ${r.race_number}: ${r.venue} at ${new Date(r.start_time).toLocaleTimeString()}`))
}

test()