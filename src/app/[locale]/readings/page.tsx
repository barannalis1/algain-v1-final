"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function useReading(type: string) {
  const [result, setResult] = useState<any>(null);
  const [pending, setPending] = useState(false);

  async function submit(body: FormData | Record<string, unknown>) {
    setPending(true);
    try {
      const res = await fetch(`/api/readings/${type}`, {
        method: "POST",
        body: body instanceof FormData ? body : JSON.stringify(body),
        headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(data);
    } finally {
      setPending(false);
    }
  }

  return { result, pending, submit };
}

export default function ReadingsPage() {
  const tarot = useReading("tarot");
  const astro = useReading("astro");
  const palm = useReading("palm");
  const coffee = useReading("coffee");

  return (
    <main className="container py-12 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-semibold">Fal Stüdyosu</h1>
        <p className="text-muted-foreground">Tarot desteleri, astrolojik haritalar, el ve kahve görselleri için yapay zekâ destekli yorumlar.</p>
      </header>
      <Tabs defaultValue="tarot" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tarot">Tarot</TabsTrigger>
          <TabsTrigger value="astro">Astro</TabsTrigger>
          <TabsTrigger value="palm">El Falı</TabsTrigger>
          <TabsTrigger value="coffee">Kahve Falı</TabsTrigger>
        </TabsList>
        <TabsContent value="tarot">
          <Card>
            <CardHeader>
              <CardTitle>Tarot Açılımı</CardTitle>
              <CardDescription>Desteyi kar, 3 kart veya Kelt haçı seç. Açıklamalar otomatik hazırlanır.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => tarot.submit({ spread: "three" })}
                disabled={tarot.pending}
              >
                {tarot.pending ? "Hazırlanıyor..." : "3 Kart Çek"}
              </Button>
              {tarot.result && (
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{tarot.result.narrative}</p>
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {tarot.result.cards?.map((card: any, index: number) => (
                      <li key={index} className="rounded-xl border border-border p-3">
                        <p className="text-sm font-semibold">{card.name}</p>
                        <p className="text-xs text-muted-foreground">{card.position}</p>
                        <p className="text-xs text-muted-foreground">{card.meaning}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="astro">
          <Card>
            <CardHeader>
              <CardTitle>Günlük Astro Rehberi</CardTitle>
              <CardDescription>Doğum bilgilerini paylaş; tema, dikkat ve fırsat alanlarını al.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  await astro.submit({
                    birthdate: form.get("birthdate"),
                    birthtime: form.get("birthtime"),
                    birthplace: form.get("birthplace"),
                  });
                }}
                className="grid gap-4 md:grid-cols-3"
              >
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="birthdate">Doğum Tarihi</label>
                  <Input id="birthdate" name="birthdate" type="date" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="birthtime">Doğum Saati</label>
                  <Input id="birthtime" name="birthtime" type="time" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground" htmlFor="birthplace">Doğum Yeri</label>
                  <Input id="birthplace" name="birthplace" placeholder="İstanbul, TR" required />
                </div>
                <Button type="submit" disabled={astro.pending} className="md:col-span-3">{astro.pending ? "Hesaplanıyor" : "Temayı Göster"}</Button>
              </form>
              {astro.result && (
                <div className="grid gap-3 md:grid-cols-3 text-sm">
                  <div className="rounded-xl border border-border p-3">
                    <h4 className="text-xs uppercase text-muted-foreground">Tema</h4>
                    <p>{astro.result.theme}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <h4 className="text-xs uppercase text-muted-foreground">Dikkat</h4>
                    <p>{astro.result.caution}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <h4 className="text-xs uppercase text-muted-foreground">Fırsat</h4>
                    <p>{astro.result.opportunity}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="palm">
          <Card>
            <CardHeader>
              <CardTitle>El Falı Analizi</CardTitle>
              <CardDescription>Sol ve sağ el fotoğraflarını yükleyerek yaşam çizgilerini incelet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  await palm.submit(form);
                }}
                className="space-y-4"
              >
                <Input name="left" type="file" accept="image/*" required />
                <Input name="right" type="file" accept="image/*" required />
                <Textarea name="notes" placeholder="Özel odak alanları..." />
                <Button type="submit" disabled={palm.pending}>{palm.pending ? "Analiz ediliyor" : "Fotoğrafları İncele"}</Button>
              </form>
              {palm.result && (
                <div className="space-y-2 text-sm">
                  <p>{palm.result.summary}</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {palm.result.lines?.map((line: any) => (
                      <li key={line.name}>{line.name}: {line.interpretation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coffee">
          <Card>
            <CardHeader>
              <CardTitle>Kahve Falı</CardTitle>
              <CardDescription>Fincan ve tabağın fotoğrafını yükle; motif tespiti ve eğlenceli yorumlar al.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  await coffee.submit(form);
                }}
                className="space-y-4"
              >
                <Input name="cup" type="file" accept="image/*" required />
                <Input name="plate" type="file" accept="image/*" />
                <Button type="submit" disabled={coffee.pending}>{coffee.pending ? "Analiz ediliyor" : "Falı Yorumla"}</Button>
              </form>
              {coffee.result && (
                <div className="space-y-2 text-sm">
                  <p>{coffee.result.summary}</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {coffee.result.motifs?.map((motif: any) => (
                      <li key={motif.name}>{motif.name}: {motif.meaning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
