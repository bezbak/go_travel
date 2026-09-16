import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

/** Photos are served by the Django backend, so its host has to be allowed. */
const apiOrigin = new URL(process.env.API_BASE_URL ?? "http://127.0.0.1:8000");

/**
 * Next 16 refuses to optimize images from private addresses (SSRF guard). In
 * development the backend sits on localhost, so the guard has to be lifted —
 * but only then: a public API hostname keeps the default protection.
 */
const isLocalHost =
  /^(localhost|\[?::1\]?|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(
    apiOrigin.hostname
  );

const nextConfig: NextConfig = {
  /*
   * Prerendering fans out over many workers by default, which is more parallel
   * traffic than Django's development server accepts. Capping the fan-out keeps
   * `next build` working against `manage.py runserver`; a production API behind
   * a real WSGI server can take much more, so raise these if builds feel slow.
   */
  experimental: {
    staticGenerationMinPagesPerWorker: 40,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 2
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowLocalIP: isLocalHost,
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
        pathname: "/media/**"
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
