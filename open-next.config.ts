import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site has no ISR or revalidation. A read-only cache backed by the static
// assets binding serves the prerendered pages (including /work/[slug]) with no
// R2 bucket or other binding (approved in DEP-20261008-165023).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
