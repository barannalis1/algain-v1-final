import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localeDetection: true,
});

export const config = {
  matcher: ["/", "/(tr|en)/:path*"],
};
