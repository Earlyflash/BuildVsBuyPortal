export interface RateLimitPolicy {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const limiterState = new Map<string, number[]>();

export function consumeRateLimit(
  key: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): RateLimitResult {
  const windowStart = now - policy.windowMs;
  const requests = limiterState.get(key) ?? [];
  const recent = requests.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= policy.maxRequests) {
    const oldestInWindow = recent[0];
    const retryAfterMs = Math.max(0, oldestInWindow + policy.windowMs - now);

    limiterState.set(key, recent);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  recent.push(now);
  limiterState.set(key, recent);

  return {
    allowed: true,
    remaining: Math.max(0, policy.maxRequests - recent.length),
    retryAfterSeconds: 0,
  };
}

export function resetRateLimitState() {
  limiterState.clear();
}
