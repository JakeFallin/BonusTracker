import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCasinos } from '@/lib/mockData';

interface CasinoPageProps {
  params: {
    slug: string;
  };
}

export default function CasinoPage({ params }: CasinoPageProps) {
  const casino = mockCasinos.find((c) => c.slug === params.slug);

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
            <Badge variant="secondary">{casino.rating.toFixed(1)}/5.0</Badge>
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