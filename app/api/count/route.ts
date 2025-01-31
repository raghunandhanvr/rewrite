import { NextResponse } from "next/server"
import { RedisRepository } from "@/repository/redis/base-repository"
import { RequestLogsRepository } from "@/repository/sql/requests-logs"

const redisRepo = new RedisRepository()
const requestLogsRepo = new RequestLogsRepository()

export async function GET() {
  try {
    const views = await redisRepo.increment("rewrite_page_views")
    const rewrites = await requestLogsRepo.countAll()

    return NextResponse.json({ views, rewrites })
  } catch (error) {
    console.error("Error fetching counts:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch counts" }),
      { status: 500 }
    )
  }
}
