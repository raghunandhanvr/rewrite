"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { track } from "@vercel/analytics"
import { useToast } from "@/hooks/use-toast"
import { rewriteText } from "@/app/_api/rewrite"
import type { RewriteStyle } from "@/app/_types/rewrite"
import InputArea from "@/app/_components/input-area"
import OutputArea from "@/app/_components/output-area"

export default function RewriteForm() {
  const [input, setInput] = useState("")
  const [style, setStyle] = useState<RewriteStyle>("professional")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { toast } = useToast()

  const handleRewrite = useCallback(async () => {
    if (!input.trim()) return
    setIsLoading(true)
    setError(null)
    setResult("")

    try {
      track("rewrite", { style })
      await rewriteText(input, style, (chunk) => {
        setResult((prev) => prev + chunk)
      })
    } catch (err) {
      console.log("error is:", err)
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }, [input, style])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleRewrite()
    },
    [handleRewrite],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>("#style-select")?.click()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit])

  useEffect(() => {
    if (error) {
      let errorMessage = "An unknown error occurred. Please try again later."
      let errorTitle = "Error"

      if (error.message.includes("Failed to generate Google Analytics ID")) {
        errorMessage = "We're having trouble with our Google Analytics system. Please try again in a few minutes."
        errorTitle = "Security Error"
      } else if (error.message.includes("No response received")) {
        errorMessage = "We couldn't get a response from our rewriting service. Please try again."
        errorTitle = "Service Unavailable"
      } else if (error instanceof TypeError) {
        errorMessage = "There seems to be a network issue. Please check your internet connection and try again."
        errorTitle = "Network Error"
      } else if (error.message.includes("500")) {
        errorMessage =
          "We're experiencing some technical difficulties. Our team has been notified and we're working on a fix."
        errorTitle = "Server Error"
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <InputArea
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            style={style}
            setStyle={setStyle}
            onRewrite={handleRewrite}
          />
        </div>
        <OutputArea
          result={result}
          setResult={setResult}
          input={input}
          style={style}
          isLoading={isLoading}
          onRegenerate={handleRewrite}
        />
      </div>
    </form>
  )
}
