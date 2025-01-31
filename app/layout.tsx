import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ui/theme-toggle"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ThemeToggle from "@/components/ui/theme-toggle"
import { KeyboardShortcutsModal } from "@/app/_components/keyboard-shortcuts-modal"
import { Footer } from "@/components/footer"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rewrite - by Raghu",
  description:
    "Easily rewrite your text while maintaining its original meaning. Choose from various styles and get instant results.",
  keywords: "rewrite, rewrite, text transformation, content writing, SEO",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rewriter.raghu.app",
    siteName: "Rewrite Website",
    images: [
      {
        url: "https://www.raghu.app/api/og?title=Rewrite",
        width: 1200,
        height: 630,
        alt: "Rewrite Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@raghunandhanvr",
    creator: "@raghunandhanvr",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-xl font-medium mb-2">Rewrite</h1>
                    <p className="text-sm text-muted-foreground max-w-[600px]">
                      Transform your text while maintaining its original meaning with LLMs. It&apos;s clean and fast.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="hidden md:block">
                      <KeyboardShortcutsModal />
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}

