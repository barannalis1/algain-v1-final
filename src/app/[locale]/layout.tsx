import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { GeistSans } from "next/font/google";

const geistSans = GeistSans({ subsets: ["latin"], variable: "--font-geist-sans" });

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <div className={`${geistSans.className} min-h-screen bg-background text-foreground`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
