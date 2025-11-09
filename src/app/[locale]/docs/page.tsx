"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function DocsPage() {
  const specUrl = "/api/docs";
  return (
    <main className="container py-12">
      <div className="rounded-3xl border border-border bg-background p-4">
        <SwaggerUI url={specUrl} docExpansion="list" />
      </div>
    </main>
  );
}
