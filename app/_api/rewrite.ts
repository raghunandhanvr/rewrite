import type { RewriteStyle } from "@/app/_types/rewrite"
import { createRequestSignature } from "@/lib/security"

const REWRITE_API_ENDPOINT = "/api/rewrite"

export async function rewriteText(text: string, style: RewriteStyle, onUpdate: (chunk: string) => void): Promise<void> {
  const timestamp = Date.now()
  const payload = { text, style }

  let gaid: string
  try {
    gaid = await createRequestSignature(payload, timestamp)
  } catch {
    throw new Error("Failed to generate Google Analytics ID. Please try again later.")
  }

  const response = await fetch(REWRITE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-gaid": gaid,
    },
    body: JSON.stringify({ ...payload, timestamp }),
  })

  if (!response.ok) {
    throw new Error(`Rewrite request failed with status ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("No response body reader found.")
  }

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    const chunk = decoder.decode(value)

    // Parse the chunk and extract only the text content
    const lines = chunk.split("\n")
    for (const line of lines) {
      if (line.startsWith("0:")) {
        // Extract the text content (remove the '0:' prefix and any surrounding quotes)
        const textContent = line.slice(2).replace(/^"|"$/g, "")
        onUpdate(textContent)
      }
    }
  }
}

