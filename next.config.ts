import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
};

// Force dev server restart to reload regenerated Prisma Client
export default nextConfig;
