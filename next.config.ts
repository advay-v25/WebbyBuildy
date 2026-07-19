import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubActions ? '/WebbyBuildy' : '';

const nextConfig: NextConfig = {
  // Use static export and unoptimized images ONLY on GitHub Pages.
  // Vercel supports native Next.js features and doesn't need a basePath.
  output: isGithubActions ? 'export' : undefined,
  images: {
    unoptimized: isGithubActions,
  },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
