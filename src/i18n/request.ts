import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const supported = ["tr", "en"];
  if (!locale || !supported.includes(locale)) {
    notFound();
  }
  return {
    messages: (await import(`../../public/locales/${locale}/common.json`)).default,
  };
});
