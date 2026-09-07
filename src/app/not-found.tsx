import Link from "next/link";

import "@/app/globals.css";
import { routing } from "@/i18n/routing";

/**
 * Fallback for requests that never reach a locale segment (so no message
 * catalogue is loaded). It has to render its own document because the only
 * root layout lives under `app/[locale]`.
 */
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            textAlign: "center"
          }}
        >
          <div style={{ maxWidth: "440px" }}>
            <p
              style={{
                color: "#669a17",
                fontSize: "68px",
                fontWeight: 900,
                lineHeight: 1,
                margin: 0
              }}
            >
              404
            </p>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                margin: "16px 0 0",
                textTransform: "uppercase"
              }}
            >
              Page not found
            </h1>
            <p style={{ color: "#5f5f5f", lineHeight: 1.6, margin: "12px 0 0" }}>
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href={`/${routing.defaultLocale}`}
              style={{
                background: "#6a9d17",
                borderRadius: "12px",
                color: "#ffffff",
                display: "inline-block",
                fontWeight: 800,
                marginTop: "24px",
                padding: "16px 32px",
                textDecoration: "none",
                textTransform: "uppercase"
              }}
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
