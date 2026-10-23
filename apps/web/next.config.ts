import type { NextConfig } from "next";
const apiOrigin = (process.env.API_PROXY_TARGET || "https://upshift-api.onrender.com").replace(/\/$/, "");
const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${apiOrigin}/api/v1/:path*` }];
  },
};
export default nextConfig;
