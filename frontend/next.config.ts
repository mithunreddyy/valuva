import crypto from "crypto";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: ["placehold.co", "localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };

      // Code splitting optimizations
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: "framework",
            chunks: "all",
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module: unknown) {
              return (
                (module as { size: () => number }).size() > 160000 &&
                /node_modules[/\\]/.test(
                  (module as { identifier: () => string }).identifier()
                )
              );
            },
            name(module: unknown) {
              const hash = crypto
                .createHash("sha1")
                .update((module as { identifier: () => string }).identifier())
                .digest("hex")
                .substring(0, 8);
              return `lib-${hash}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name(module: unknown, chunks: unknown[]) {
              return crypto
                .createHash("sha1")
                .update(
                  chunks.reduce((acc: string, chunk: unknown) => {
                    return acc + (chunk as { name: string }).name;
                  }, "")
                )
                .digest("hex")
                .substring(0, 8);
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }
    return config;
  },
};

export default nextConfig;
