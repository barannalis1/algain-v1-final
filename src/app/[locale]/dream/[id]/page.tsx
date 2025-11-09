import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DreamDetailPage({ params }: { params: { locale: string; id: string } }) {
  const dream = await prisma.dream.findUnique({
    where: { id: params.id },
    include: { interpretation: true, videos: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!dream) return notFound();

  return (
    <main className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Rüya Detayı</CardTitle>
          <CardDescription>
            {dream.createdAt.toLocaleString("tr-TR")} tarihinde kaydedildi. {dream.audioUrl ? "Ses kaydı mevcut." : "Metin rüya."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Rüya Metni</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{dream.text}</p>
          </div>
          {dream.interpretation && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="success">Ton: {dream.interpretation.tone}</Badge>
                <Badge variant="outline">Dil: {dream.interpretation.lang}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{dream.interpretation.summary}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Semboller</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {dream.interpretation.symbols.map((symbol) => (
                      <li key={symbol}>{symbol}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Öneriler</h4>
                  <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                    {dream.interpretation.advice.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <form action={`/api/dreams/${dream.id}/video`} method="post" className="flex gap-3">
            <Button type="submit">Videoya dönüştür</Button>
            {dream.videos[0]?.outputUrl && (
              <Button asChild variant="outline">
                <a href={dream.videos[0].outputUrl} target="_blank" rel="noreferrer">mp4 indir</a>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
