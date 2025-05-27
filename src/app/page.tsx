import { CasinoInfoCard } from '@/components/features/CasinoInfoCard';
import { mockCasinos } from '@/lib/mockData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { HomePageCarousel } from '@/components/features/HomePageCarousel';

export default async function Home() {
  const session = await getServerSession(authOptions);
  let savedCasinoIds: string[] = [];

  if (session?.user?.id) {
    const userSavedCasinos = await prisma.savedCasino.findMany({
      where: { userId: session.user.id },
      select: { casinoId: true },
    });
    savedCasinoIds = userSavedCasinos.map(c => c.casinoId);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Find the Best Sweepstakes Casino Bonuses
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Compare top-rated sweepstakes casinos, exclusive bonuses, and detailed reviews.
              Your trusted guide to online sweepstakes gaming.
            </p>
            <div className="flex justify-center gap-4">
          <a
                href="/casinos"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Browse Casinos
          </a>
          <a
                href="/guides"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Read Guides
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Casinos Carousel */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="mb-8 text-3xl font-bold text-center">Top Rated Casinos</h2>
        <HomePageCarousel casinos={mockCasinos} savedCasinoIds={savedCasinoIds} />
      </section>

      {/* What are Sweepstakes Casinos */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-center">What are Sweepstakes Casinos?</h2>
            <div className="prose prose-slate dark:prose-invert">
              <p>
                Sweepstakes casinos are online gaming platforms that operate under sweepstakes laws,
                allowing players to enjoy casino-style games without real money gambling. These
                platforms use virtual currencies like Gold Coins and Sweeps Coins, with the latter
                being redeemable for real prizes.
              </p>
              <p>
                Key features of sweepstakes casinos include:
              </p>
              <ul>
                <li>Free-to-play model with optional purchases</li>
                <li>Legal in most US states</li>
                <li>No real money gambling required</li>
                <li>Chance to win real prizes</li>
                <li>Wide variety of casino games</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
