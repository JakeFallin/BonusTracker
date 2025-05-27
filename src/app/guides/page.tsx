import Link from 'next/link';
import { Button } from '@/components/ui/button';

const guides = [
  {
    title: 'Getting Started with Sweepstakes Casinos',
    description: 'Learn the basics of sweepstakes casinos, how they work, and how to get started.',
    href: '/guides/getting-started',
  },
  {
    title: 'Understanding Sweeps Coins vs Gold Coins',
    description: 'A detailed explanation of the different virtual currencies used in sweepstakes casinos.',
    href: '/guides/coins-explained',
  },
  {
    title: 'How to Redeem Prizes',
    description: 'Step-by-step guide on how to redeem your Sweeps Coins for real prizes.',
    href: '/guides/redeeming-prizes',
  },
  {
    title: 'Tips for Maximizing Your Bonuses',
    description: 'Learn how to make the most of welcome bonuses and promotions.',
    href: '/guides/maximizing-bonuses',
  },
];

export default function GuidesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">Sweepstakes Casino Guides</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about sweepstakes casinos, from getting started
          to maximizing your rewards.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {guides.map((guide) => (
          <div
            key={guide.href}
            className="rounded-lg border bg-card p-6"
          >
            <h2 className="mb-2 text-xl font-semibold">{guide.title}</h2>
            <p className="mb-4 text-muted-foreground">{guide.description}</p>
            <Button asChild variant="outline">
              <Link href={guide.href}>Read Guide</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 