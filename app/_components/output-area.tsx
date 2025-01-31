import { useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { track } from "@vercel/analytics"
import type { RewriteStyle } from "@/app/_types/rewrite"

interface OutputAreaProps {
  result: string
  setResult: (value: string) => void
  input: string
  style: RewriteStyle
  isLoading: boolean
  onRegenerate: () => void
}

export default function OutputArea({ result, setResult, input, style, isLoading, onRegenerate }: OutputAreaProps) {
  const handleRegenerate = useCallback(() => {
    if (input) {
      track("regenerate", { style })
      onRegenerate()
    }
  }, [input, style, onRegenerate])

  return (
    <div className="flex-1 space-y-4">
      <Textarea
        value={result}
        onChange={(e) => setResult(e.target.value)}
        placeholder="Rewritten text will appear here..."
        className="h-[300px]"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        readOnly
      />
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">{result.length} characters</div>
        <Button
          onClick={handleRegenerate}
          disabled={!input || isLoading}
          variant="outline"
          size="icon"
          title="Regenerate"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

