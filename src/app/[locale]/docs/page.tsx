import { Suspense } from "react";

async function fetchSpec() {
  const res = await fetch("/api/docs", { cache: "no-store" });
  if (!res.ok) {
    return { error: "Spec unavailable" };
  }
  return res.json();
}

async function SpecViewer() {
  const spec = await fetchSpec();
  return (
    <pre className="rounded-2xl bg-muted p-6 text-xs overflow-x-auto whitespace-pre-wrap">
      {JSON.stringify(spec, null, 2)}
    </pre>
  );
}

export default function DocsPage() {
  return (
    <main className="container py-12 space-y-6">
      <h1 className="text-3xl font-semibold">OpenAPI Özeti</h1>
      <Suspense fallback={<div className="h-40 rounded-2xl bg-muted animate-pulse" /> }>
        {/* @ts-expect-error Async Server Component */}
        <SpecViewer />
      </Suspense>
    </main>
  );
}
