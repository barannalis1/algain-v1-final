import { ReactNode } from "react";

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

export default function LocaleLayout({ children }: { children: ReactNode; params: { locale: string } }) {
  return <div className="min-h-screen bg-background text-foreground font-sans">{children}</div>;
}
