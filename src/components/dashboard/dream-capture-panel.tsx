"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

async function createDream(text: string, audio?: File) {
  const formData = new FormData();
  formData.append("text", text);
  if (audio) formData.append("audio", audio);
  const res = await fetch("/api/dreams", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Rüya oluşturulamadı");
  return res.json();
}

async function interpretDream(id: string) {
  const res = await fetch(`/api/dreams/${id}/interpret`, { method: "POST" });
  if (!res.ok) throw new Error("Yorum alınamadı");
  return res.json();
}

async function requestVideo(id: string) {
  const res = await fetch(`/api/dreams/${id}/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ template: "2D-Flat-Dream", aspect: "9:16", fps: 24 }),
  });
  if (!res.ok) throw new Error("Video kuyruğuna alınamadı");
  return res.json();
}

type ScenePlan = {
  title: string;
  subtitle: string;
  palette: string[];
  animation: string;
  duration: number;
};

type DreamState = {
  id?: string;
  text: string;
  tags: string[];
  audioUrl?: string;
  transcript?: string;
  mood?: string;
  analysis?: {
    summary: string;
    symbols: string[];
    advice: string[];
    tone: string;
    videoPlan?: ScenePlan[];
  };
  services: {
    tarot: boolean;
    astro: boolean;
    palm: boolean;
    coffee: boolean;
  };
  video?: {
    status: "idle" | "queued" | "rendering" | "ready" | "error";
    template?: string;
    aspect?: string;
    fps?: number;
    url?: string;
    thumb?: string;
    error?: string;
  };
};

const initialDream: DreamState = {
  text: "",
  tags: [],
  services: {
    tarot: true,
    astro: true,
    palm: false,
    coffee: false,
  },
};

type Props = {
  compact?: boolean;
};

export function DreamCapturePanel({ compact }: Props) {
  const [dream, setDream] = useState<DreamState>(initialDream);
  const [activeTab, setActiveTab] = useState("text");
  const [audioFile, setAudioFile] = useState<File | undefined>();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateDream = (data: Partial<DreamState>) => {
    setDream((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = () => {
    if (!dream.text && !audioFile) {
      setError("Rüya metni veya ses kaydı gereklidir");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const payload = await createDream(dream.text, audioFile);
        updateDream({ id: payload.id, text: payload.text });
        const interpretation = await interpretDream(payload.id);
        updateDream({
          analysis: {
            summary: interpretation.summary,
            symbols: interpretation.symbols,
            advice: interpretation.advice,
            tone: interpretation.tone,
            videoPlan: interpretation.storyboard,
          },
          mood: interpretation.mood,
        });
      } catch (e: any) {
        setError(e?.message || "Yorum alınamadı");
      }
    });
  };

  const handleVideo = () => {
    if (!dream.id || !dream.analysis || !dream.analysis.videoPlan) return;
    startTransition(async () => {
      try {
        const job = await requestVideo(dream.id!);
        updateDream({
          video: {
            status: "queued",
            template: job.template,
            aspect: job.aspect,
            fps: job.fps,
            url: job.outputUrl,
          },
        });
      } catch (e: any) {
        setError(e?.message || "Video kuyruğu hatası");
      }
    });
  };

  return (
    <div className={cn("space-y-6", compact && "space-y-4") }>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="text">Metin</TabsTrigger>
          <TabsTrigger value="audio">Ses Yükle</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Rüyanı buraya yaz veya yapıştır..."
            value={dream.text}
            onChange={(event) => updateDream({ text: event.target.value })}
          />
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">duygu: {dream.mood || "belirsiz"}</Badge>
            {dream.analysis?.symbols?.map((symbol) => (
              <Badge key={symbol} variant="outline">{symbol}</Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="audio" className="space-y-4">
          <Input
            type="file"
            accept="audio/webm,audio/mp3,audio/mp4"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file && file.size > 100 * 1024 * 1024) {
                setError("Dosya boyutu 100MB altında olmalıdır");
                return;
              }
              setAudioFile(file || undefined);
            }}
          />
          {audioFile && <p className="text-xs text-muted-foreground">Seçilen dosya: {audioFile.name}</p>}
        </TabsContent>
      </Tabs>
      <div className="flex flex-wrap gap-3">
        <Button disabled={pending} onClick={handleSubmit}>
          {pending ? "Yorumlanıyor..." : "Rüyayı Yorumla"}
        </Button>
        <Button variant="outline" disabled={!dream.analysis || pending} onClick={handleVideo}>
          Animasyon Oluştur
        </Button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {dream.analysis && (
        <div className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">Ton: {dream.analysis.tone}</Badge>
            <Badge variant="outline">Mood: {dream.mood}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{dream.analysis.summary}</p>
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Semboller</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {dream.analysis.symbols.map((symbol) => (
                  <li key={symbol}>{symbol}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Öneriler</h4>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                {dream.analysis.advice.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          {dream.analysis.videoPlan && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Storyboard</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {dream.analysis.videoPlan.map((scene, index) => (
                  <div key={index} className="rounded-xl border border-border/60 p-3">
                    <p className="text-sm font-medium">{scene.title}</p>
                    <p className="text-xs text-muted-foreground">{scene.subtitle}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <span>{scene.animation}</span>
                      <span>• {scene.duration}s</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      {scene.palette.map((color) => (
                        <span key={color} className="h-3 w-6 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {dream.video?.status === "queued" && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-primary">
              Animasyon üretimi kuyruğa alındı. Hazır olduğunda mp4 indirme bağlantısı burada görünecek.
            </div>
          )}
          {dream.video?.url && (
            <div className="rounded-xl border border-emerald-300/50 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              Video hazır! <a className="underline" href={dream.video.url} target="_blank" rel="noreferrer">mp4 indir</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
