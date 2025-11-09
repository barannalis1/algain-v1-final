import Link from "next/link";
import { labelTryWithEur } from "@/lib/fx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

async function PricingCards() {
  const premium = await labelTryWithEur(Number(process.env.PREMIUM_PRICE_TRY || 99));
  const pro = await labelTryWithEur(Number(process.env.PRO_PRICE_TRY || 199));

  const plans = [
    {
      tier: "Free",
      price: "₺0 (360p önizleme)",
      highlight: false,
      features: ["Günlük 3 yorum", "360p video önizleme", "Filigranlı paylaşım"],
      checkout: "/auth/signin",
    },
    {
      tier: "Premium",
      price: `${premium} / ay`,
      highlight: false,
      features: ["Sınırsız yorum", "Ayda 5 video (1080p, filigransız)", "Öncelikli kuyruk"],
      checkout: "/api/checkout?plan=premium",
    },
    {
      tier: "Pro",
      price: `${pro} / ay`,
      highlight: true,
      features: ["Sınırsız video (4K)", "Özel koçluk raporları", "API erişimi"],
      checkout: "/api/checkout?plan=pro",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.tier} className={`p-6 space-y-4 ${plan.highlight ? "border-primary border-2" : ""}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{plan.tier}</h3>
            {plan.highlight && <span className="badge border-primary/50 bg-primary/10 text-primary">En Popüler</span>}
          </div>
          <p className="text-3xl font-semibold" title="Tutarlar bilgilendirme amaçlı çevrildi">{plan.price}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {plan.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <form action={plan.checkout} method="post">
            <Button type="submit" className="w-full">
              {plan.tier === "Free" ? "Ücretsiz Başla" : `${plan.tier}'a geç`}
            </Button>
          </form>
        </Card>
      ))}
      <p className="md:col-span-3 text-xs text-muted-foreground">
        Tutarlar bilgilendirme amaçlı yaklaşık EUR karşılığıyla gösterilir; tahsilat TRY ile yapılır.
      </p>
      <div className="md:col-span-3 text-center">
        <Button variant="link" asChild>
          <Link href="/pricing">Detaylı fiyatlandırma</Link>
        </Button>
      </div>
    </div>
  );
}

export async function PricingPreview() {
  return <PricingCards />;
}
