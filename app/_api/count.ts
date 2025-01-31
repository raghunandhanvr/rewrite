const COUNT_API_ENDPOINT = "/api/count"

export async function fetchCounts(): Promise<{ views: number; rewrites: number }> {
    const response = await fetch(COUNT_API_ENDPOINT)
    if (!response.ok) {
      throw new Error(`Failed to fetch counts. Status: ${response.status}`)
    }
  
    const data = await response.json()
    return {
      views: data.views ?? 0,
      rewrites: data.rewrites ?? 0,
    }
  }
  
  