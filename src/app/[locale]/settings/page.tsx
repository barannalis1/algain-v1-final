import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listUserTimezones } from "@/lib/data-store";

export default async function SettingsPage() {
  const locales = ["tr", "en"];
  const tzs = listUserTimezones(5);

  return (
    <main className="container py-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>KVKK/GDPR kapsamında verilerini yönet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="name">Ad Soyad</label>
              <Input id="name" name="name" placeholder="İsim" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground" htmlFor="locale">Dil</label>
              <select id="locale" name="locale" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                {locales.map((locale) => (
                  <option key={locale} value={locale}>{locale.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-muted-foreground" htmlFor="tz">Zaman Dilimi</label>
              <select id="tz" name="tz" className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                {tzs.map((item) => (
                  <option key={item.tz} value={item.tz}>{item.tz}</option>
                ))}
                <option value="Europe/Istanbul">Europe/Istanbul</option>
              </select>
            </div>
            <Button type="submit" className="md:col-span-2">Kaydet</Button>
          </form>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="badge">Veri indir</span>
            <span className="badge">Veri sil</span>
            <span className="badge">18+ eğlence amaçlı uyarısı</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
