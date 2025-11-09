import { notFound } from "next/navigation";

export default {
  locales: ["tr", "en"],
  defaultLocale: "tr",
  async loadLocaleFrom(locale: string, namespace: string) {
    try {
      return (await import(`./public/locales/${locale}/${namespace}.json`)).default;
    } catch (error) {
      notFound();
    }
  },
};
