import { labelTryWithEur } from "@/lib/fx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    id: "free",
    title: "Free",
    features: [
      "Günlük 3 rüya yorumu",
      "360p video önizleme (filigranlı)",
      "Tarot/Astro/El/Kahve modüllerine sınırlı erişim",
    ],
    cta: "Ücretsiz Başla",
    checkout: "/auth/signin",
    highlighted: false,
  },
  {
    id: "premium",
    title: "Premium",
    features: [
      "Sınırsız yorum",
      "Ayda 5 video 1080p (filigransız)",
      "Öncelikli kuyruk ve hızlı ASR",
    ],
    cta: "Premium'a geç",
    checkout: "/api/checkout?plan=premium",
    highlighted: false,
  },
  {
    id: "pro",
    title: "Pro",
    features: [
      "Sınırsız video (4K)",
      "Özel koçluk raporu & API anahtarı",
      "Özel Remotion şablonları ve marka kimliği",
    ],
    cta: "Pro'ya geç",
    checkout: "/api/checkout?plan=pro",
    highlighted: true,
  },
];

export default async function PricingPage() {
  const premiumLabel = await labelTryWithEur(Number(process.env.PREMIUM_PRICE_TRY || 99));
  const proLabel = await labelTryWithEur(Number(process.env.PRO_PRICE_TRY || 199));

  const planPrices: Record<string, string> = {
    free: "₺0 / ay",
    premium: `${premiumLabel} / ay`,
    pro: `${proLabel} / ay`,
  };

  return (
    <main className="container py-16 space-y-12">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold">DreamOracle Üyelikleri</h1>
        <p className="text-muted-foreground">
          Tutarlar TRY olarak tahsil edilir, ancak kullanıcı arayüzünde günlük döviz kuru ile ≈ EUR karşılığını otomatik
          gösteririz. Stripe ürünleri TRY fiyatlandırması ile yapılandırılmalıdır.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`p-6 space-y-4 ${plan.highlighted ? "border-primary border-2" : ""}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{plan.title}</h2>
              {plan.highlighted && <span className="badge border-primary/50 bg-primary/10 text-primary">Pro</span>}
            </div>
            <p className="text-3xl font-semibold" title="Tutarlar bilgilendirme amaçlı çevrildi">{planPrices[plan.id]}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <form action={plan.checkout} method="post">
              <Button type="submit" className="w-full">
                {plan.cta}
              </Button>
            </form>
          </Card>
        ))}
      </section>
      <p className="text-xs text-muted-foreground">
        ≈ EUR ibaresi bilgilendirme amaçlıdır; tüm tahsilatlar TRY cinsindendir. Döviz verisi {(process.env.FX_SOURCE_URL || "https://api.exchangerate.host/latest?base=TRY&symbols=EUR")} kaynağından 12 saatte bir güncellenir, hata durumunda ENV fallback değerine döner.
      </p>
    </main>
  );
}
