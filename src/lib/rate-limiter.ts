import { redis } from './redis'
import { Ratelimit } from "@upstash/ratelimit";

export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '15 s'),
    prefix: '@upstash/ratelimit',
})