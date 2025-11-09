"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CoachingPreview() {
  const [message, setMessage] = useState<string>("09:00 motivasyon kartların hazır.");

  useEffect(() => {
    fetch("/api/me/coach/daily")
      .then((res) => res.ok ? res.json() : { message: message })
      .then((data) => setMessage(data.message))
      .catch(() => null);
  }, []);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Yaşam Koçluğu</h3>
          <p className="text-sm text-muted-foreground">Her sabah 09:00'da kişisel motivasyon bildirimi.</p>
        </div>
        <Button asChild variant="outline">
          <a href="/coach">Ayrıntılar</a>
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
    </Card>
  );
}
