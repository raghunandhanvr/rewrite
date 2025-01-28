import ParaphraseForm from "@/components/paraphrase-form"
import ThemeToggle from "@/components/ui/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-medium mb-2">Paraphraser</h1>
              <p className="text-sm text-muted-foreground max-w-[600px]">
                Transform your text while maintaining its original meaning. It&apos;s clean and fast.
              </p>
            </div>
            <ThemeToggle />
          </div>
          <ParaphraseForm />
        </div>
      </main>
      <footer className="w-full text-center text-xs text-muted-foreground py-2 mb-8">
        <a href="https://github.com/raghunandhanvr" className="hover:text-blue-600 hover:underline transition-colors">
          @raghunandhanvr
        </a>
      </footer>
    </div>
  )
}

