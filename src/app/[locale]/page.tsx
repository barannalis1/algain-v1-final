import { Suspense } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DreamCapturePanel } from "@/components/dashboard/dream-capture-panel";
import { FortuneGrid } from "@/components/dashboard/fortune-grid";
import { VideoShowcase } from "@/components/dashboard/video-showcase";
import { CoachingPreview } from "@/components/dashboard/coaching-preview";
import { PricingPreview } from "@/components/dashboard/pricing-preview";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="bg-gradient-to-br from-[#1c1f3a] via-[#1a0f2f] to-[#180b21] text-white">
        <div className="container py-24">
          <Badge variant="success" className="mb-6 bg-emerald-500/20 text-emerald-200">
            dreamoracle.space • Yapay zekâ destekli rüya stüdyosu
          </Badge>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Rüyalarını yakala, yorumla, pastel animasyonlara dönüştür.
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                DreamOracle; rüyanı yazmanı veya sesle anlatmanı sağlar, Tarot, astroloji, el ve kahve modülleriyle sembolleri
                çözümler, GPT destekli yorumunu hemen sunar ve Remotion ile 18 saniyelik 2D animasyon mini filmler üretir.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="app">Panoya Git</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="#demo">Canlı Akışa Bak</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />GPT-4o ve Whisper yorumları</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-400" />Remotion 2D Flat • Kinetic • Rotoscope</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pink-400" />Stripe TRY abonelikleri</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/40 blur-3xl" />
              <Card className="bg-white/10 backdrop-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Rüya Stüdyosu Demo</CardTitle>
                  <CardDescription className="text-white/70">
                    Metin + ses + görsel yükleme → saniyeler içinde yorum ve storyboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DreamCapturePanel compact />
                </CardContent>
                <CardFooter className="flex flex-col gap-3 text-xs text-white/60">
                  <span>Anonim demo verileri gösterilmektedir. Oturum açarak rüyalarını kaydedebilirsin.</span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Rüya toplama, yorumlama ve animasyon bir arada</h2>
            <p className="text-muted-foreground text-lg">
              DreamOracle; Whisper ile ses kayıtlarını çözümler, GPT tabanlı sembol analizi yapar, tarot ve astro içgörülerini
              harmanlayarak 3 adımlık öneriler sunar. Her yorum otomatik storyboard sahnelerine dönüşür ve Remotion + FFmpeg
              kuyruğuna düşer. Üretilen mp4 dosyalarını Supabase Storage üzerinde saklarız.
            </p>
            <FortuneGrid />
          </div>
          <div className="space-y-6">
            <VideoShowcase />
            <CoachingPreview />
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container grid gap-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold">Üyelik planları (TRY) ≈ EUR rehberliğiyle</h2>
            <p className="text-muted-foreground">
              Free üyelik günde 3 yoruma kadar izin verir ve 360p filigranlı önizleme sağlar. Premium ve Pro katmanları Stripe
              üzerinden TRY tahsilat yapar, arayüzde otomatik ≈ EUR karşılığını gösterir.
            </p>
          </div>
          <Suspense fallback={<div className="h-40 rounded-3xl bg-gradient-to-r from-muted to-muted/50 animate-shimmer" /> }>
            <PricingPreview />
          </Suspense>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>KVKK/GDPR Uyumlu</CardTitle>
              <CardDescription>
                18+ uyarıları, veri indir-sil seçenekleri ve içerik güvenliği ile etik çerçeve sağlanır.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Sentry ile hataları izliyor, pino ile logluyor, hassas içerikler için GPT moderasyon kullanıyoruz.</p>
              <p>Admin panelinden abonelikler, kuyruklar, şablonlar ve günlük motivasyon mesajları yönetilebilir.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild>
                <Link href="docs">OpenAPI & Swagger</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dağıtım & Gözlemlenebilirlik</CardTitle>
              <CardDescription>
                Vercel (web/api), Render veya Fly.io üzerinde çalışan BullMQ workerları.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Redis destekli kuyruklar ASR, yorum ve video render işlerini yönetir. Cron job her kullanıcının yerel 09:00 saatinde motivasyon maili gönderir.</p>
              <p>Remotion şablonları 9:16 ve 16:9 formatta H.264/AAC mp4 olarak dışa aktarılır.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild>
                <Link href="pricing">Fiyatlandırma sayfası</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
