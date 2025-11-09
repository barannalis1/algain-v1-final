import { generateCoachingPrompt } from "@/lib/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function CoachPage() {
  const mood = "hopeful";
  const message = await generateCoachingPrompt(mood);
  const users = await prisma.user.count();

  return (
    <main className="container py-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Günlük Motivasyon</CardTitle>
          <CardDescription>Her kullanıcı için yerel saatle 09:00'da gönderilen e-posta ve push bildirimleri.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{message}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="badge">Aktif kullanıcılar: {users}</span>
            <span className="badge">Cron: 09:00 kullanıcı TZ</span>
          </div>
          <form action="/api/notify/test" method="post">
            <Button type="submit">Test Bildirim Gönder</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
