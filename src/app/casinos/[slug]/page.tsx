import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCasinos } from '@/lib/mockData';

const tierColorMap: Record<string, string> = {
  "Fantastic": "bg-purple-200 text-purple-800 border-purple-300 dark:bg-purple-700 dark:text-purple-100 dark:border-purple-600",
  "Excellent": "bg-green-200 text-green-800 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600",
  "Great": "bg-orange-200 text-orange-800 border-orange-300 dark:bg-orange-700 dark:text-orange-100 dark:border-orange-600",
  "Solid": "bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600",
  "Unproven": "bg-pink-200 text-pink-800 border-pink-300 dark:bg-pink-700 dark:text-pink-100 dark:border-pink-600",
};

// Generate static paths for each casino
export async function generateStaticParams() {
  return mockCasinos.map((casino) => ({
    slug: casino.slug,
  }));
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;
  const casino = mockCasinos.find((c) => c.slug === awaitedParams.slug);

  if (!casino) {
    notFound();
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
          <Image
            src={casino.logoUrl}
            alt={`${casino.name} logo`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{casino.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge className={`${tierColorMap[casino.tier] || 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'}`}>{casino.tier}</Badge>
          </div>
        </div>
      </div>

      {/* Welcome Bonus */}
      <section className="mb-8 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-2xl font-semibold">Welcome Bonus</h2>
        <div className="space-y-2">
          <p className="text-xl font-medium text-primary">
            {casino.welcomeBonus.amount}
          </p>
          <p className="text-muted-foreground">
            {casino.welcomeBonus.description}
          </p>
        </div>
        <Button className="mt-4">Claim Bonus</Button>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {casino.features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg border bg-card p-4"
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mb-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Pros</h2>
          <ul className="space-y-2">
            {casino.pros.map((pro) => (
              <li key={pro} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Cons</h2>
          <ul className="space-y-2">
            {casino.cons.map((con) => (
              <li key={con} className="flex items-center gap-2">
                <span className="text-red-500">×</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Games */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Available Games</h2>
        <div className="flex flex-wrap gap-2">
          {casino.games.map((game) => (
            <Badge key={game} variant="outline">
              {game}
            </Badge>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Payment Methods</h2>
        <div className="flex flex-wrap gap-2">
          {casino.paymentMethods.map((method) => (
            <Badge key={method} variant="secondary">
              {method}
            </Badge>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">User Reviews</h2>
        <div className="space-y-4">
          {casino.reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{review.author}</div>
                <Badge variant="secondary">{review.rating}/5</Badge>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 