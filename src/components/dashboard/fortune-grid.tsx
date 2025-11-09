"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const services = [
  {
    id: "tarot",
    title: "Tarot",
    description: "3 kart / Kelt açılımları, otomatik desteleme, ters/düz anlam",
  },
  {
    id: "astro",
    title: "Yıldız Falı",
    description: "Doğum bilgisiyle günlük tema, dikkat ve fırsatlar",
  },
  {
    id: "palm",
    title: "El Falı",
    description: "Sol/sağ el fotoğraflarından yaşam/kalp/baş çizgisi analizi",
  },
  {
    id: "coffee",
    title: "Kahve Falı",
    description: "Fincan ve tabağındaki motiflerden eğlenceli hikâyeler",
  },
];

type ReadingSummary = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
};

export function FortuneGrid() {
  const [latest, setLatest] = useState<ReadingSummary[]>([]);

  useEffect(() => {
    fetch("/api/readings/feed")
      .then((res) => res.ok ? res.json() : { items: [] })
      .then((data) => setLatest(data.items || []))
      .catch(() => setLatest([]));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const match = latest.find((item) => item.type === service.id.toUpperCase());
        return (
          <Card key={service.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <Badge variant={match ? "success" : "outline"}>{match ? "Canlı" : "Hazır"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{service.description}</p>
            {match && (
              <p className="text-xs text-muted-foreground/80">
                Son yorum: {new Date(match.createdAt).toLocaleString("tr-TR")}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
