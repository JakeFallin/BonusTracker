import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { mockCasinos } from '@/lib/mockData'; // Import mockCasinos

// Helper function to update user's total aggregates
async function updateUserTotals(userId: string) {
  try {
    const savedCasinos = await prisma.savedCasino.findMany({
      where: { userId },
      select: {
        balance: true,
        depositTotal: true,
        dailyScMin: true,
        dailyScMax: true,
      },
    });

    const totalBalance = savedCasinos.reduce((sum, casino) => sum + (casino.balance ?? 0), 0);
    const totalDeposits = savedCasinos.reduce((sum, casino) => sum + (casino.depositTotal ?? 0), 0);
    const totalDailyScMin = savedCasinos.reduce((sum, casino) => sum + (casino.dailyScMin ?? 0), 0);
    const totalDailyScMax = savedCasinos.reduce((sum, casino) => sum + (casino.dailyScMax ?? 0), 0);

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalBalance,
        totalDeposits,
        totalDailyScMin,
        totalDailyScMax,
      },
    });
  } catch (error) {
    console.error('[UPDATE_USER_TOTALS_ERROR]', `Failed to update totals for user ${userId}:`, error);
    // Decide if this error should propagate or be handled silently
    // For now, it logs the error and doesn't throw, to not break the primary operation
  }
}

// Helper function to parse SC value from string
// const parseScValue = (scString: string | undefined): number => {
//   if (!scString) return 1;
//   const match = scString.match(/(\d*\.?\d+)/);
//   return match ? parseFloat(match[1]) : 1;
// };

// Helper function to generate a random rating (can be defined here or imported if shared)
const getRandomRating = () => {
  return parseFloat((Math.random() * (4.9 - 4.4) + 4.4).toFixed(1));
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { casinoId } = body;
    // Prefer client-provided dailyScMin/Max, these match DB field names
    const clientDailyScMin = body.dailyScMin;
    const clientDailyScMax = body.dailyScMax;

    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }

    let finalInitialDailyScMin: number;
    let finalInitialDailyScMax: number;

    if (typeof clientDailyScMin === 'number' && typeof clientDailyScMax === 'number') {
      finalInitialDailyScMin = clientDailyScMin;
      finalInitialDailyScMax = clientDailyScMax;
    } else {
      // Client did not provide specific SC values, use defaults from mockCasino data
      const casinoFromMock = mockCasinos.find(c => c.id === casinoId);
      if (!casinoFromMock) {
        console.warn(`[SAVE_CASINO_POST] Casino with id ${casinoId} not found in mockData for defaults. Defaulting SC values to 0.`);
        finalInitialDailyScMin = 0;
        finalInitialDailyScMax = 0;
      } else {
        // mockCasinos use dailyMinSc and dailyMaxSc properties
        finalInitialDailyScMin = casinoFromMock.dailyMinSc ?? 0;
        finalInitialDailyScMax = casinoFromMock.dailyMaxSc ?? 0;
      }
    }

    const initialRating = getRandomRating();

    const savedCasino = await prisma.savedCasino.create({
      data: {
        userId: session.user.id,
        casinoId,
        balance: 0,
        depositTotal: 0,
        dailyScMin: finalInitialDailyScMin, // Save to DB field dailyScMin
        dailyScMax: finalInitialDailyScMax, // Save to DB field dailyScMax
        rating: initialRating,
      },
    });

    await updateUserTotals(session.user.id);

    return NextResponse.json(savedCasino);
  } catch (error) {
    console.error('[SAVE_CASINO_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { casinoId } = await req.json();
    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }

    await prisma.savedCasino.delete({
      where: {
        userId_casinoId: {
          userId: session.user.id,
          casinoId,
        },
      },
    });

    await updateUserTotals(session.user.id); // Update totals

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[SAVE_CASINO_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// New PUT method to update amounts
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { casinoId, balance, depositTotal, dailyScMin: receivedDailyScMin, dailyScMax: receivedDailyScMax } = await req.json();

    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }

    if (balance === undefined || 
        depositTotal === undefined || 
        receivedDailyScMin === undefined || 
        receivedDailyScMax === undefined) {
      return new NextResponse('Balance, Deposit Total, Daily SC Min, and Daily SC Max are required', { status: 400 });
    }

    const parsedBalance = parseFloat(balance);
    const parsedDepositTotal = parseFloat(depositTotal);
    const parsedDailyScMin = parseFloat(receivedDailyScMin);
    const parsedDailyScMax = parseFloat(receivedDailyScMax);

    const dataToUpdate = {
      balance: isNaN(parsedBalance) ? 0 : parsedBalance,
      depositTotal: isNaN(parsedDepositTotal) ? 0 : parsedDepositTotal,
      dailyScMin: isNaN(parsedDailyScMin) ? 0 : parsedDailyScMin,
      dailyScMax: isNaN(parsedDailyScMax) ? 0 : parsedDailyScMax,
      updatedAt: new Date(),
    };

    const updatedAmounts = await prisma.savedCasino.update({
      where: {
        userId_casinoId: {
          userId: session.user.id,
          casinoId,
        },
      },
      data: dataToUpdate,
    });

    await updateUserTotals(session.user.id);

    return NextResponse.json(updatedAmounts);
  } catch (error) {
    console.error('[SAVE_CASINO_PUT_AMOUNTS]', error);
    if ((error as any).code === 'P2025') {
        return new NextResponse('Saved casino not found', { status: 404 });
    }
    return new NextResponse('Internal error while updating amounts', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { casinoId } = await req.json();

    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }

    // Note: The PATCH endpoint here only updates lastVisited. 
    // If PATCH could also affect values summed in updateUserTotals, 
    // then updateUserTotals() should be called here too.
    // For now, assuming it doesn't change those values.
    const updatedCasino = await prisma.savedCasino.update({
      where: {
        userId_casinoId: {
          userId: session.user.id,
          casinoId,
        },
      },
      data: {
        lastVisited: new Date(),
        updatedAt: new Date(), 
      },
    });

    return NextResponse.json(updatedCasino);
  } catch (error) {
    console.error('[SAVE_CASINO_PATCH_LAST_VISITED]', error);
    if ((error as any).code === 'P2025') {
      return new NextResponse('Saved casino not found', { status: 404 });
    }
    return new NextResponse('Internal error while updating last visited time', { status: 500 });
  }
} 