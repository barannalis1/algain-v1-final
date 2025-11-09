import { DreamCapturePanel } from "@/components/dashboard/dream-capture-panel";
import { FortuneGrid } from "@/components/dashboard/fortune-grid";
import { VideoShowcase } from "@/components/dashboard/video-showcase";
import { CoachingPreview } from "@/components/dashboard/coaching-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="container py-12 space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        <Card>
          <CardHeader>
            <CardTitle>Rüya Stüdyosu</CardTitle>
          </CardHeader>
          <CardContent>
            <DreamCapturePanel />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <FortuneGrid />
          <VideoShowcase />
          <CoachingPreview />
        </div>
      </section>
    </main>
  );
}
