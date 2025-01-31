import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

export class RedisRepository {
  private redis: Redis
  private ratelimit: Ratelimit

  constructor() {
    this.redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })

    this.ratelimit = new Ratelimit({
      redis: this.redis,
      limiter: Ratelimit.slidingWindow(5, "10 s"),
    })
  }

  // Generic methods
  async get<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(key)
  }

  async set(key: string, value: unknown): Promise<unknown> {
    return this.redis.set(key, value)
  }

  async increment(key: string): Promise<number> {
    return this.redis.incr(key)
  }

  async decrement(key: string): Promise<number> {
    return this.redis.decr(key)
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key)
  }

  async exists(key: string): Promise<number> {
    return this.redis.exists(key)
  }

  // List operations
  async listPush(key: string, ...elements: any[]): Promise<number> {
    return this.redis.rpush(key, ...elements)
  }

  async listPop(key: string): Promise<string | null> {
    return this.redis.lpop(key)
  }

  async listRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.lrange(key, start, stop)
  }

  // Hash operations
  async hashSet(key: string, field: string, value: string): Promise<number> {
    return this.redis.hset(key, { [field]: value })
  }

  async hashGet(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field)
  }

  async hashGetAll(key: string): Promise<Record<string, string> | null> {
    return this.redis.hgetall(key)
  }

  // Set operations
  async setAdd(key: string, members: string[]): Promise<number> {
    return this.redis.sadd(key, members)
  }

  async setMembers(key: string): Promise<string[]> {
    return this.redis.smembers(key)
  }

  // Sorted set operations
  async sortedSetAdd(key: string, score: number, member: string): Promise<number | null> {
    return this.redis.zadd(key, { score, member })
  }

  async sortedSetRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrange(key, start, stop)
  }

  // Rate limiter
  getRateLimiter(): Ratelimit {
    return this.ratelimit
  }

  // Specific methods for our current use case
  async incrementViewCount(): Promise<number | null> {
    return this.increment("view_count")
  }

  async getViewCount(): Promise<number | null> {
    return this.get<number>("view_count") ?? 0
  }

  async incrementRewriteCount(): Promise<number | null> {
    return this.increment("rewrite_count")
  }

  async getRewriteCount(): Promise<number | null> {
    return this.get<number>("rewrite_count") ?? 0
  }
}

