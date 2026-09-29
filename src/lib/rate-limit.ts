import { LRUCache } from "lru-cache"

interface RateLimitRecord {
    count: number
    resetTime: number
}

// Global cache for rate limiting instances by namespace
const limiters = new Map<string, LRUCache<string, RateLimitRecord>>()

function getLimiter(namespace: string, ttl: number, maxKeys: number = 2000): LRUCache<string, RateLimitRecord> {
    let limiter = limiters.get(namespace)
    if (!limiter) {
        limiter = new LRUCache<string, RateLimitRecord>({
            max: maxKeys,
            ttl: ttl,
        })
        limiters.set(namespace, limiter)
    }
    return limiter
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    reset: number
    limit: number
}

/**
 * Checks and increments the rate limit counter for a given identifier within a namespace.
 * 
 * @param namespace Distinct bucket (e.g. 'auth:login', 'ai:chat', 'api:diagnostico')
 * @param identifier Unique key (IP, user ID, or composite)
 * @param limit Maximum allowed requests within windowMs
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(
    namespace: string,
    identifier: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    const limiter = getLimiter(namespace, windowMs)
    const now = Date.now()
    const record = limiter.get(identifier)

    if (!record || record.resetTime <= now) {
        limiter.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            success: true,
            remaining: limit - 1,
            reset: now + windowMs,
            limit,
        }
    }

    if (record.count >= limit) {
        return {
            success: false,
            remaining: 0,
            reset: record.resetTime,
            limit,
        }
    }

    record.count += 1
    limiter.set(identifier, record)

    return {
        success: true,
        remaining: Math.max(0, limit - record.count),
        reset: record.resetTime,
        limit,
    }
}

/**
 * Helper to safely extract client IP from incoming Next.js Request headers.
 */
export function getClientIp(req: Request): string {
    const cfConnectingIp = req.headers.get("cf-connecting-ip")
    if (cfConnectingIp) return cfConnectingIp.trim()

    const xRealIp = req.headers.get("x-real-ip")
    if (xRealIp) return xRealIp.trim()

    const xForwardedFor = req.headers.get("x-forwarded-for")
    if (xForwardedFor) {
        const firstIp = xForwardedFor.split(",")[0]?.trim()
        if (firstIp) return firstIp
    }

    return "127.0.0.1"
}
