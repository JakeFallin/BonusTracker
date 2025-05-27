import { MyCasinoCard } from '@/components/features/MyCasinoCard';
import { UserProfile } from '@/components/auth/UserProfile';
import { StatsDisplay } from '@/components/features/StatsDisplay';
import { mockCasinos } from '@/lib/mockData';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { Casino } from '@/lib/types';
import { authOptions } from '@/lib/auth';

// Extend Casino type to include amounts for the merged object
interface CasinoWithSavedData extends Casino {
  savedBalance?: number;
  savedDepositTotal?: number;
  savedDailyScValue?: number;
  savedLastVisited?: Date | null;
  savedRating?: number;
}

export default async function MyCasinosPage() {
  const session = await getServerSession(authOptions);
  
  let casinosToDisplay: CasinoWithSavedData[] = [];
  let totalBalance = 0; // Initialize totalBalance
  let totalDeposits = 0;
  let totalDailySC = 0;

  if (session?.user?.id) {
    const userSavedRecords = await prisma.savedCasino.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        casinoId: true,
        balance: true,
        depositTotal: true,
        dailyScValue: true,
        lastVisited: true,
        rating: true,
      },
    });
    
    // Calculate total balance
    totalBalance = userSavedRecords.reduce((sum, record) => sum + record.balance, 0);
    totalDeposits = userSavedRecords.reduce((sum, record) => sum + record.depositTotal, 0);
    totalDailySC = userSavedRecords.reduce((sum, record) => sum + record.dailyScValue, 0);

    casinosToDisplay = mockCasinos
      .filter(mc => userSavedRecords.some(sr => sr.casinoId === mc.id))
      .map(mc => {
        const savedRecord = userSavedRecords.find(sr => sr.casinoId === mc.id)!; // Assert savedRecord exists
        return {
          ...mc,
          savedBalance: savedRecord.balance,
          savedDepositTotal: savedRecord.depositTotal,
          savedDailyScValue: savedRecord.dailyScValue,
          savedLastVisited: savedRecord.lastVisited,
          savedRating: savedRecord.rating,
        };
      });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-center">My Casinos</h1>
        <p className="text-lg text-muted-foreground text-center">
          Track your favorite sweepstakes casinos and manage your daily rewards.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols">
        {/* Profile Sidebar */}
        <div className="space-y-6">
        </div>

        {/* Main content area: Stats + Casino List */}
        <div className="flex flex-col gap-8">
          <StatsDisplay 
            savedCasinoCount={casinosToDisplay.length} 
            totalBalance={totalBalance}
            totalDeposits={totalDeposits}
            totalDailySC={totalDailySC}
          />
          
          {/* Casino List */}
          <div className="space-y-4">
            {casinosToDisplay.length > 0 ? (
              casinosToDisplay.map((casino) => (
                <MyCasinoCard 
                  key={casino.id} 
                  casino={casino} 
                  initialBalance={casino.savedBalance}
                  initialDepositTotal={casino.savedDepositTotal}
                  initialDailyScValue={casino.savedDailyScValue}
                  initialLastVisited={casino.savedLastVisited}
                  initialRating={casino.savedRating}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You haven't saved any casinos yet. Browse the casinos page to add some!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 