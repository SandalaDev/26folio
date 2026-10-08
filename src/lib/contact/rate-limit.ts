// Rate limiting behind an interface. The in-memory implementation is for local
// development and best effort only: a Worker isolate's memory is not a shared
// counter and resets whenever the isolate recycles. The authoritative limit is
// a Cloudflare WAF rate-limiting rule (TASK-122 decision, TASK-129 setup).

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

export const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
} as const;

type Options = {
  limit: number;
  windowMs: number;
  /** Injectable clock for tests. */
  now?: () => number;
  /** Hard cap on tracked keys so a flood of addresses cannot grow memory. */
  maxKeys?: number;
};

export function createMemoryRateLimiter(options: Options): RateLimiter {
  const { limit, windowMs } = options;
  const now = options.now ?? Date.now;
  const maxKeys = options.maxKeys ?? 5000;
  const hits = new Map<string, number[]>();

  function prune(at: number) {
    for (const [key, stamps] of hits) {
      const live = stamps.filter((stamp) => at - stamp < windowMs);
      if (live.length === 0) hits.delete(key);
      else hits.set(key, live);
    }
  }

  return {
    check(key) {
      const at = now();
      if (hits.size >= maxKeys && !hits.has(key)) prune(at);
      const live = (hits.get(key) ?? []).filter((stamp) => at - stamp < windowMs);
      if (live.length >= limit) {
        hits.set(key, live);
        const retryMs = live[0] + windowMs - at;
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(retryMs / 1000)),
        };
      }
      live.push(at);
      hits.set(key, live);
      return { allowed: true };
    },
  };
}
