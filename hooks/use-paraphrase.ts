import { useState } from "react"
import { useCompletion } from "ai/react"
import type { ParaphraseStyle } from "@/types"
import { createRequestSignature } from '@/lib/security'

export function useParaphrase() {
  const [error, setError] = useState<Error | null>(null)

  const { complete, isLoading } = useCompletion({
    api: "/api/paraphrase",
  })

  const paraphrase = async (text: string, style: ParaphraseStyle): Promise<string | null> => {
    setError(null)
    try {
      const timestamp = Date.now()
      const payload = { text, style }
      let gaid: string
      try {
        gaid = await createRequestSignature(payload, timestamp)
      } catch (signatureError) {
        throw new Error("Failed to generate Google Analytics ID. Please try again later.")
      }

      const result = await complete("", { 
        body: { 
          ...payload, 
          timestamp
        },
        headers: {
          'x-gaid': gaid
        }
      })
      return result?.trim() || null
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      return null
    }
  }

  return { paraphrase, isLoading, error }
}