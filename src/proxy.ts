import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // `apple-icon` and `opengraph-image` are extensionless metadata routes, so
  // they need excluding by name or the locale redirect swallows them.
  matcher: "/((?!api|trpc|_next|_vercel|apple-icon|opengraph-image|.*\\..*).*)"
};
