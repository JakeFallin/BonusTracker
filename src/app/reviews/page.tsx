import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCasinos } from '@/lib/mockData';

export default function ReviewsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Casino Reviews</h1>
        <p className="text-lg text-muted-foreground">
          Read our detailed reviews of the top sweepstakes casinos. We cover everything
          from bonuses and games to user experience and customer support.
        </p>
      </div>

      <div className="space-y-8">
        {mockCasinos.map((casino) => (
          <div
            key={casino.id}
            className="rounded-lg border bg-card p-6"
          >
            <div className="mb-6 flex items-center gap-6">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={casino.logoUrl}
                  alt={`${casino.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{casino.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary">{casino.rating.toFixed(1)}/5.0</Badge>
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Welcome Bonus</h3>
                <p className="text-muted-foreground">
                  {casino.welcomeBonus.amount}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {casino.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <Button asChild>
                <Link href={`/casinos/${casino.slug}`}>Read Full Review</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 