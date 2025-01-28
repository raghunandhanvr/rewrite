import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

interface ParaphraseLog {
  requestBody: {
    text: string
    style: string
  }
  responseBody: string
  userAgent: string
}

export async function logParaphrase(log: ParaphraseLog) {
  await sql`
    INSERT INTO request_logs (request_body, response_body, user_agent)
    VALUES (${JSON.stringify(log.requestBody)}, ${log.responseBody}, ${log.userAgent})
  `
}