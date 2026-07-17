import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Spotify album art for the 10s playlist (EPIC-018/TASK-071).
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
    ],
  },
};

export default nextConfig;
