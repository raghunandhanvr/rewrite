import { createGroq } from "@ai-sdk/groq"
import { streamText, createDataStreamResponse } from "ai"
import { RequestLogsRepository } from "@/repository/sql/requests-logs"
import { RedisRepository } from "@/repository/redis/base-repository"

export const runtime = "edge"

export async function POST(req: Request) {
  const { text, style } = await req.json()
  const userAgent = req.headers.get("user-agent") || "unknown"
  const requestLogsRepo = new RequestLogsRepository()
  const redisRepo = new RedisRepository()

  const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })

  const prompt = `You are a rewriting assistant. Your task is to rewrite the text I provide in a clear, concise manner using the following style: (${style}). Keep the original meaning exactly the same. Use direct and simple language—avoid complex phrasing or abstract vocabulary. Do not ask questions or provide additional commentary. Do not include quotation marks in your response. Only output the rewritten text (no headings, disclaimers, or explanations).
  Text to rewrite: ${text}`

  return createDataStreamResponse({
    execute: async (dataStream) => {
      let fullResponse = ""

      const result = streamText({
        model: groq(process.env.GROQ_MODEL || "llama3-70b-8192"),
        prompt,
        temperature: 0.5,
        onChunk: (chunk) => {
          fullResponse += chunk
          dataStream.writeData(chunk)
        },
        onFinish: async () => {
          try {
            await requestLogsRepo.insertOne({
              request_body: JSON.stringify({ text, style }),
              response_body: fullResponse,
              user_agent: userAgent,
            })
            await redisRepo.incrementRewriteCount()
          } catch (err) {
            console.error("Error inserting log or incrementing rewrite count:", err)
            dataStream.writeData("Error occurred during logging")
          }
        },
      })

      result.mergeIntoDataStream(dataStream)
    },
    onError: (error) => {
      return error instanceof Error ? error.message : String(error)
    },
  })
}
