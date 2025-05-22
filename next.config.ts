import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  revalidate: 0,
  staticPageGenerationTimeout: 0
};

export default nextConfig;
