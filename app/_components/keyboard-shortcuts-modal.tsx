import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

export function KeyboardShortcutsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Keyboard className="h-5 w-5" />
          <span className="sr-only">Keyboard shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-m font-semibold">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          {[
            { action: "Choose style", shortcut: "Cmd/Ctrl + K" },
            { action: "Rewrite", shortcut: "Cmd/Ctrl + Enter" },
          ].map(({ action, shortcut }) => (
            <div key={action} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{action}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded">{shortcut}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

