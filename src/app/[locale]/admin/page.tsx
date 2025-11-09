import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const queues = [
    { name: "asr", size: await prisma.videoJob.count({ where: { status: "QUEUED" } }) },
    { name: "interpret", size: await prisma.interpretation.count() },
    { name: "render", size: await prisma.videoJob.count({ where: { status: "RENDERING" } }) },
  ];
  const logs = await prisma.webhookLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 });

  return (
    <main className="container py-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Kontrol Paneli</CardTitle>
          <CardDescription>Abonelikler, kuyruklar, loglar ve şablon yönetimi.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">İş Kuyrukları</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {queues.map((queue) => (
                <li key={queue.name} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span>{queue.name.toUpperCase()}</span>
                  <span className="badge">{queue.size}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">Kuyrukları Yenile</Button>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Webhook Logları</h3>
            <ul className="space-y-2 text-xs text-muted-foreground max-h-72 overflow-y-auto">
              {logs.map((log) => (
                <li key={log.id} className="rounded-xl border border-border p-3">
                  <p className="font-medium">{log.type}</p>
                  <p>{log.status}</p>
                  <p>{log.createdAt.toLocaleString("tr-TR")}</p>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
