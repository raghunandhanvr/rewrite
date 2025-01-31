"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Copy } from "lucide-react"
import { fetchCounts } from "@/app/_api/count"

export function Footer() {
  const [countData, setCountData] = useState({ views: 0, rewrites: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const getCounts = async () => {
      try {
        const data = await fetchCounts()
        setCountData(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
  
    getCounts()
  }, [])

  const copyUPI = () => {
    navigator.clipboard.writeText("8667322394@ptaxis")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="w-full text-center text-xs text-muted-foreground py-2 mb-8 flex justify-center items-center">
      <a href="https://github.com/raghunandhanvr" className="hover:text-blue-600 hover:underline transition-colors">
        @raghunandhanvr
      </a>
      <span className="mx-1">|</span>
      {loading ? (
        <span className="animate-pulse">Loading counts...</span>
      ) : error ? (
        <span className="text-red-600">Error fetching counts</span>
      ) : (
        <>
          <span>{countData.views} views</span>
          <span className="mx-1">|</span>
          <span>{countData.rewrites} rewrites</span>
        </>
      )}
      <span className="mx-1">|</span>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="text-xs text-muted-foreground hover:text-blue-600 hover:underline transition-colors inline-flex items-center">
            <Heart className="h-3 w-3 text-red-500 mr-1" />
            <span>sponsor</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-m">Please Support</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Your support helps me continue creating. Thank you for your generosity!
            </p>
            <div className="flex items-center justify-center space-x-2 bg-muted p-2 rounded-md">
              <span className="font-mono">UPI ID: 8667322394@ptaxis</span>
              <Button variant="ghost" size="icon" onClick={copyUPI}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-green-500 text-sm">Copied to clipboard!</p>}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

