import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ui/theme-toggle"
import "./globals.css"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Paraphrasing Tool",
  description:
    "Easily paraphrase your text while maintaining its original meaning. Choose from various styles and get instant results.",
  keywords: "paraphrase, rewrite, text transformation, content writing, SEO",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://paraphrase.website",
    siteName: "Paraphrase Website",
    images: [
      {
        url: "https://www.raghu.app/api/og?title=Paraphraser",
        width: 1200,
        height: 630,
        alt: "Paraphrase Website",
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
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}

