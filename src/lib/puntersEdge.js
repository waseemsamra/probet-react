const PUNTERSEDGE_API_KEY = import.meta.env.VITE_PUNTERSEDGE_API_KEY
const PUNTERSEDGE_BASE_URL = import.meta.env.VITE_PUNTERSEDGE_BASE_URL || 'https://api.puntersedge.online/v1'

async function fetchPuntersEdge(endpoint, params = {}) {
  const url = new URL(`${PUNTERSEDGE_BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  })

  const response = await fetch(url, {
    headers: {
      'X-API-Key': PUNTERSEDGE_API_KEY,
      'Accept': 'application/json'
    }
  })

  const creditsRemaining = response.headers.get('X-Credits-Remaining')
  if (creditsRemaining) {
    console.log(`[PuntersEdge] Credits remaining: ${creditsRemaining}`)
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(`PuntersEdge API error: ${error.message || response.statusText}`)
  }

  return response.json()
}

export async function getNextToGo({ numRaces = 10, country = 'AU', category = 'horse' } = {}) {
  const data = await fetchPuntersEdge('/racing/next-to-go', { num_races: numRaces, country, category })
  // Filter for horse races only (API may return mixed)
  return (data || []).filter(race => race.category === 'horse')
}

export async function getSportsOdds(sportKey, { markets = 'h2h' } = {}) {
  return fetchPuntersEdge(`/sports/${sportKey}/odds`, { markets })
}

export async function getRaceCard(raceId) {
  return fetchPuntersEdge(`/racing/race-card/${raceId}`)
}

export async function getRunnerOdds(runnerId) {
  return fetchPuntersEdge(`/racing/runner-odds/${runnerId}`)
}

export async function getMeetingList({ date, country } = {}) {
  return fetchPuntersEdge('/racing/meetings', { date, country })
}

export async function getLiveOdds({ raceIds } = {}) {
  return fetchPuntersEdge('/racing/live-odds', { race_ids: raceIds?.join(',') })
}

export { fetchPuntersEdge }