import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { text, style } = await req.json()

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })

  const prompt = `Paraphrase the following text in a ${style} style, maintaining the original meaning but changing the wording significantly. Do not include any quotation marks in your response:\n\n${text}`

  const result = streamText({
    model: groq("llama3-70b-8192"),
    prompt,
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}

