"use client"

import { useState, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Wand2, RefreshCw, Trash } from 'lucide-react'
import { useParaphrase } from "@/hooks/use-paraphrase"
import { PARAPHRASE_STYLES } from "@/lib/constants"
import type { ParaphraseStyle } from "@/types"
import { track } from "@vercel/analytics"

export default function ParaphraseForm() {
  const [input, setInput] = useState("")
  const [style, setStyle] = useState<ParaphraseStyle>("professional")
  const [result, setResult] = useState("")

  const { paraphrase, isLoading, error } = useParaphrase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    track("paraphrase", { style })
    const paraphrased = await paraphrase(input, style)
    if (paraphrased) setResult(paraphrased)
  }

  const handleRegenerate = () => {
    if (input) {
      track("regenerate", { style })
      paraphrase(input, style).then((res) => res && setResult(res))
    }
  }

  const clearInput = useCallback(() => {
    setInput("")
    setResult("")
    track("clear_input")
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="Enter your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-[300px] border-dotted"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
          <div className="flex items-center space-x-2">
            <Select
              value={style}
              onValueChange={(v) => {
                setStyle(v as ParaphraseStyle)
                track("select_style", { style: v })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {PARAPHRASE_STYLES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-1"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Paraphrase
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearInput}
              className="text-red-500"
              disabled={!input.trim()}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground text-right">{input.length} characters</div>
        </div>

        <div className="flex-1 space-y-4">
          <Textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Paraphrased text will appear here..."
            className="h-[300px]"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            readOnly
          />
          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button onClick={handleRegenerate} disabled={!input || isLoading} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4"/>
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-right">{result.length} characters</div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "An error occurred while paraphrasing. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}
