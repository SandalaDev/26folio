// Client IP for rate limiting. On Cloudflare the edge sets `cf-connecting-ip`;
// the first `x-forwarded-for` hop covers local development. Neither present
// yields one shared fallback key, never an error.

export const UNKNOWN_CLIENT = "unknown";

export function clientIp(headers: Pick<Headers, "get">): string {
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return UNKNOWN_CLIENT;
}
