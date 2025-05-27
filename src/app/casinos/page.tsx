import { CasinoInfoCard } from '@/components/features/CasinoInfoCard';
import { mockCasinos } from '@/lib/mockData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function CasinosPage() {
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-center">Casino Info</h1>
        <p className="text-lg text-muted-foreground text-center">
          Browse our curated list of top-rated sweepstakes casinos. Compare bonuses,
          features, and user reviews to find your perfect match.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <select className="rounded-md border px-3 py-2">
          <option>Sort by Rating</option>
          <option>Sort by Bonus</option>
          <option>Sort by Name</option>
        </select>
        <select className="rounded-md border px-3 py-2">
          <option>All Games</option>
          <option>Slots</option>
          <option>Table Games</option>
          <option>Live Dealer</option>
        </select>
      </div>

      {/* Casino List */}
      <div className="space-y-4">
        {mockCasinos.map((casino) => (
          <CasinoInfoCard 
            key={casino.id} 
            casino={casino} 
            initiallySaved={savedCasinoIds.includes(casino.id)}
          />
        ))}
      </div>
    </div>
  );
} 