import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig({
  // Uncomment to enable R2 cache,
  // It should be imported as:
  // `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
  // See https://opennext.js.org/cloudflare/caching for more details
  // incrementalCache: r2IncrementalCache,
});

export default {
  ...cloudflareConfig,
  // This is required to avoid infinite recursion when "npm run build"
  // is set to "opennextjs-cloudflare build" in package.json
  buildCommand: "npx next build",
};
