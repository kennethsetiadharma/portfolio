// Absolute base URL of the site, used for the share image, canonical link, robots.txt
// and sitemap. On Vercel this is the production domain, so it follows a custom domain
// automatically. Set NEXT_PUBLIC_SITE_URL to override; locally it is localhost.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
