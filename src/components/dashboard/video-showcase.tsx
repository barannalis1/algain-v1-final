"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VideoShowcase() {
  const [status, setStatus] = useState<null | { id: string; status: string; outputUrl?: string; template: string }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!status || !status.id) return;
      fetch(`/api/videos/${status.id}`)
        .then((res) => res.json())
        .then((data) => setStatus(data))
        .catch(() => null);
    }, 6000);
    return () => clearInterval(interval);
  }, [status?.id]);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Animasyon Kuyruğu</h3>
          <p className="text-sm text-muted-foreground">Remotion şablonlarıyla 18 sn pastel mini filmler.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStatus({ id: "demo", status: "rendering", template: "2D-Flat-Dream" })}
        >
          Demo Render Takip
        </Button>
      </div>
      <div className="rounded-2xl border border-dashed border-primary/40 p-6 text-sm text-muted-foreground space-y-2">
        <p>Şablonlar: 2D Flat • Kinetic Typography • Rotoscope.</p>
        <p>Çıkış formatları: mp4 (H.264/AAC), 9:16 &amp; 16:9, 24/30 fps.</p>
        {status && (
          <p className="text-primary text-sm">
            Durum: {status.status} ({status.template}) {status.outputUrl ? `→ ${status.outputUrl}` : ""}
          </p>
        )}
      </div>
    </Card>
  );
}
