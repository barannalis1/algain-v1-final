import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "DreamOracle",
  description: "AI-assisted dream interpretation, fortunes, and animated storytelling.",
  metadataBase: new URL("https://dreamoracle.space"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
