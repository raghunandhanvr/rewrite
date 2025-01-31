import { useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Trash } from 'lucide-react'
import { track } from "@vercel/analytics"
import { PARAPHRASE_STYLES } from "@/constants/rewrite-form"
import type { RewriteStyle } from "@/app/_types/rewrite"

interface InputAreaProps {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  style: RewriteStyle
  setStyle: (value: RewriteStyle) => void
  onRewrite: () => void
}

export default function InputArea({ input, setInput, isLoading, style, setStyle, onRewrite }: InputAreaProps) {
  const clearInput = useCallback(() => {
    setInput("")
    track("clear_input")
  }, [setInput])

  return (
    <div className="flex-1 space-y-4">
      <Textarea
        placeholder="Enter your text here..."
        className="h-[300px] border-dotted [&::placeholder]:md:content-['Enter_your_text_here...(⌘/Ctrl_+_Enter_to_rewrite)']"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">{input.length} characters</div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={clearInput}
          className="text-red-500"
          disabled={!input.trim() || isLoading}
          title="Clear"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={style}
          onValueChange={(value: RewriteStyle) => {
            setStyle(value)
            track("select_style", { style: value })
          }}
        >
          <SelectTrigger id="style-select" className="w-[180px]">
            <SelectValue placeholder="Select style (⌘/Ctrl + K)" />
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
          title="Rewrite (⌘/Ctrl + Enter)"
          onClick={onRewrite}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Rewrite
        </Button>
      </div>
    </div>
  )
}
