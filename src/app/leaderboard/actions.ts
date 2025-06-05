'use server';

import { prisma } from '@/lib/db'; // Corrected Prisma client import path
import type { User as PrismaUser } from '@prisma/client'; // Removed PrismaSavedCasino as it's not directly used here with the new interface

// Define a type for the structure of SavedCasino data we need
interface SavedCasinoData {
  balance: number;
  dailyScMin: number | null; // Corrected: Align with client expectation
  dailyScMax: number | null; // Corrected: Align with client expectation
}

// Define a type for the user object as fetched from Prisma, including relations
interface UserWithSavedCasinos extends PrismaUser {
  savedCasinos: SavedCasinoData[];
}

export interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  totalBalance: number;
  dailyBonus: number;
}

export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  try {
    const usersWithSavedCasinos: UserWithSavedCasinos[] = await prisma.user.findMany({
      include: {
        savedCasinos: {
          select: {
            balance: true,
            dailyScMin: true, // Corrected: Align with client expectation
            dailyScMax: true, // Corrected: Align with client expectation
          },
        },
      },
    });

    if (!usersWithSavedCasinos || usersWithSavedCasinos.length === 0) {
      console.warn("[Leaderboard] No users with saved casino data found from Prisma query.");
      // Depending on how the error is triggered, you might want to throw or return empty here.
      // For now, it will proceed and map, resulting in an empty leaderboardUsers array if this condition is met.
    }

    const leaderboardUsers: LeaderboardUser[] = usersWithSavedCasinos.map((user: UserWithSavedCasinos) => {
      const totalBalance = user.savedCasinos.reduce((sum: number, casino: SavedCasinoData) => sum + casino.balance, 0);
      // Calculate dailyBonus using dailyScMin, defaulting to 0 if null
      const dailyBonus = user.savedCasinos.reduce((sum: number, casino: SavedCasinoData) => sum + (casino.dailyScMin ?? 0), 0); // Corrected
      
      return {
        id: user.id,
        name: user.name,
        image: user.image,
        totalBalance,
        dailyBonus,
      };
    });

    // Optional: Filter out users with no significant scores if that's desired for the leaderboard
    // const qualifiedLeaderboardUsers = leaderboardUsers.filter(user => user.totalBalance > 0 || user.dailyBonus > 0);
    // return qualifiedLeaderboardUsers;

    return leaderboardUsers;

  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return []; // Return empty array on error
  }
} 