'use client';

import { useTimers } from '@/hooks/useTimers';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Bookmark, DollarSign } from 'lucide-react';

interface StatsDisplayProps {
  savedCasinoCount: number;
  totalBalance?: number;
  totalDeposits?: number;
  totalDailySC?: number;
}

export function StatsDisplay({ savedCasinoCount, totalBalance, totalDeposits, totalDailySC }: StatsDisplayProps) {
  

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    // Assuming totalDailySC is not currency, format it as a number
    if (amount === totalDailySC && typeof amount === 'number') return amount.toFixed(2) + ' SC'; 
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="flex-1 min-w-[150px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Saved Casinos</p>
              <p className="text-2xl font-bold">{savedCasinoCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {totalBalance !== undefined && (
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {totalDeposits !== undefined && (
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Deposits</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDeposits)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {totalDailySC !== undefined && (
        <Card className="flex-1 min-w-[150px]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Daily SC</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDailySC)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 