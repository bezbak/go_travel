/**
 * pm2 configuration for both services.
 *
 * Backend  — gunicorn on 8005
 * Frontend — next start on 3017
 *
 * Secrets are not written here: this file is in git. Export DJANGO_SECRET_KEY
 * (or source an env file) in the shell that runs `pm2 start`, and pm2 passes it
 * through to the process.
 *
 *   set -a; . /srv/go_travel_back/.env; set +a
 *   pm2 start ecosystem.config.js
 *
 * Adjust `cwd` and the three PUBLIC_* constants below to match the server.
 */

// The address visitors reach the backend on. It ends up in `og:image` URLs, so
// social previews only work when this is publicly resolvable. Page photos do
// not depend on it: Next fetches those server-side and re-serves them itself.
const PUBLIC_API = process.env.API_BASE_URL || "http://example.com:8005";

// Hostnames Django answers on, and the origin the site is served from.
const ALLOWED_HOSTS = "example.com,127.0.0.1,localhost";
const SITE_ORIGIN = "http://example.com:3017";

module.exports = {
  apps: [
    {
      name: "go-travel-api",
      cwd: "/srv/go_travel_back",
      // Called through the interpreter rather than the console script so pm2
      // signals gunicorn itself instead of a shebang wrapper.
      script: ".venv/bin/python",
      args:
        "-m gunicorn config.wsgi:application " +
        "--bind 0.0.0.0:8005 --workers 3 --timeout 60",
      interpreter: "none",
      autorestart: true,
      max_restarts: 10,
      env: {
        DJANGO_SECRET_KEY: process.env.DJANGO_SECRET_KEY,
        DJANGO_DEBUG: "0",
        // Without nginx nothing else serves media/ and staticfiles/, and every
        // photo on the site would 404. Drop this once nginx fronts the app.
        DJANGO_SERVE_FILES: "1",
        DJANGO_ALLOWED_HOSTS: ALLOWED_HOSTS,
        DJANGO_CSRF_TRUSTED_ORIGINS: PUBLIC_API,
        DJANGO_CORS_ORIGINS: SITE_ORIGIN,
        DJANGO_LANGUAGE_CODE: "ru"
      }
    },
    {
      name: "go-travel-web",
      cwd: "/srv/go_travel",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3017",
      interpreter: "node",
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
        API_BASE_URL: PUBLIC_API
      }
    }
  ]
};
