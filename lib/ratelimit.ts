import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 🛡️ ZERO-TRUST RATE LIMITING CONFIGURATION

// Initialize Redis client
const redis = Redis.fromEnv();

// 🚀 STANDARD USER LIMIT: 60 requests per minute
export const userRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "ratelimit:user",
});

// 🔐 AUTH ROUTE LIMIT: 5 requests per minute (stricter for login/register)
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

// ⚡ ADMIN LIMIT: 100 requests per minute (higher for admin operations)
export const adminRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "ratelimit:admin",
});

// 🎯 API RATE LIMIT HELPER
export async function checkRateLimit(
  identifier: string,
  type: "user" | "auth" | "admin" = "user"
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = type === "auth" ? authRateLimit : type === "admin" ? adminRateLimit : userRateLimit;
  const result = await limiter.limit(identifier);
  
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// 🛡️ RATE LIMIT MIDDLEWARE HELPER
export function getRateLimitHeaders(result: { success: boolean; limit: number; remaining: number; reset: number }) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}
