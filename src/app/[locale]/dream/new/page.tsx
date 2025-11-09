import { DreamCapturePanel } from "@/components/dashboard/dream-capture-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewDreamPage() {
  return (
    <main className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Rüya</CardTitle>
          <CardDescription>Rüyanı metin olarak paylaş veya ses kaydı yükle; Whisper ile otomatik çözümlenir.</CardDescription>
        </CardHeader>
        <CardContent>
          <DreamCapturePanel />
        </CardContent>
      </Card>
    </main>
  );
}
