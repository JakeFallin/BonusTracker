import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { dailySC as globalDailySC } from '@/lib/dailySC';

// Helper function to parse SC value from string
const parseScValue = (scString: string | undefined): number => {
  if (!scString) return 1;
  const match = scString.match(/(\d*\.?\d+)/);
  return match ? parseFloat(match[1]) : 1;
};

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

    const { casinoId } = await req.json();
    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }

    const initialRating = getRandomRating(); // Generate random rating
    const initialDailySc = parseScValue(globalDailySC[casinoId as keyof typeof globalDailySC]);

    const savedCasino = await prisma.savedCasino.create({
      data: {
        userId: session.user.id,
        casinoId,
        balance: 0,
        depositTotal: 0,
        dailyScValue: initialDailySc,
        rating: initialRating, // Store the random rating
      },
    });

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

    const { casinoId, balance, depositTotal, dailyScValue } = await req.json();

    if (!casinoId) {
      return new NextResponse('Casino ID is required', { status: 400 });
    }
    if (balance === undefined || depositTotal === undefined || dailyScValue === undefined) {
      return new NextResponse('Balance, Deposit Total, and Daily SC Value are required', { status: 400 });
    }

    const updatedAmounts = await prisma.savedCasino.update({
      where: {
        userId_casinoId: {
          userId: session.user.id,
          casinoId,
        },
      },
      data: {
        balance: parseFloat(balance),
        depositTotal: parseFloat(depositTotal),
        dailyScValue: parseFloat(dailyScValue),
        updatedAt: new Date(), // Explicitly set updatedAt
      },
    });

    return NextResponse.json(updatedAmounts);
  } catch (error) {
    console.error('[SAVE_CASINO_PUT_AMOUNTS]', error);
    // Consider more specific error for not found (P2025)
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

    const updatedCasino = await prisma.savedCasino.update({
      where: {
        userId_casinoId: {
          userId: session.user.id,
          casinoId,
        },
      },
      data: {
        lastVisited: new Date(),
        updatedAt: new Date(), // Also update the updatedAt timestamp
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