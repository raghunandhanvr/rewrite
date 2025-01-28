import { useState } from "react"
import { useCompletion } from "ai/react"
import type { ParaphraseStyle } from "@/types"

export function useParaphrase() {
  const [error, setError] = useState<Error | null>(null)

  const { complete, isLoading } = useCompletion({
    api: "/api/paraphrase",
  })

  const paraphrase = async (text: string, style: ParaphraseStyle): Promise<string | null> => {
    setError(null)
    try {
      const result = await complete("", { body: { text, style } })
      return result?.trim() || null
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      return null
    }
  }

  return { paraphrase, isLoading, error }
}

