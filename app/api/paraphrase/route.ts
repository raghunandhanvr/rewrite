import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { logParaphrase } from '@/lib/db'
import { NextResponse } from 'next/server'

export const runtime = "edge"

export async function POST(req: Request) {
  const { text, style } = await req.json()
  const userAgent = req.headers.get('user-agent') || 'unknown'

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })

  const prompt = `Rephrase the text below in a clear and simple way, without using abstract or overly complex words. Use the style described: (${style}). Keep the meaning exactly the same and make sure the wording is direct and easy to understand. Do not include any quotation marks in your response:\n\n${text}`

  const result = streamText({
    model: groq("llama3-70b-8192"),
    prompt,
    temperature: 0.7,
  })

  let fullResponse = ''

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const decoded = new TextDecoder().decode(chunk)
      fullResponse += decoded
      controller.enqueue(chunk)
    },
    flush() {
      logParaphrase({
        requestBody: { text, style },
        responseBody: fullResponse,
        userAgent
      }).catch(console.error)
    }
  })

  return new NextResponse(result.toDataStreamResponse().body?.pipeThrough(transformStream))
}
