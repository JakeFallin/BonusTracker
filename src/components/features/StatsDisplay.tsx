'use client';

import { useTimers } from '@/hooks/useTimers';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Bookmark, DollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatsDisplayProps {
  savedCasinoCount: number;
  totalBalance?: number;
  totalDeposits?: number;
  totalMinDailySC?: number;
  totalMaxDailySC?: number;
}

const AVG_DAYS_PER_MONTH = 30.4375; // More precise average
const AVG_DAYS_PER_YEAR = 365.25;   // Accounts for leap years

export function StatsDisplay({ savedCasinoCount, totalBalance, totalDeposits, totalMinDailySC, totalMaxDailySC }: StatsDisplayProps) {
  
  const formatCurrency = (amount: number | undefined, isSC: boolean = false) => {
    if (amount === undefined) return 'N/A';
    if (isSC) return amount.toFixed(2) + ' SC'; 
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const monthlyMinSC = totalMinDailySC !== undefined ? (totalMinDailySC * AVG_DAYS_PER_MONTH).toFixed(2) + ' SC' : 'N/A';
  const monthlyMaxSC = totalMaxDailySC !== undefined ? (totalMaxDailySC * AVG_DAYS_PER_MONTH).toFixed(2) + ' SC' : 'N/A';
  const yearlyMinSC = totalMinDailySC !== undefined ? (totalMinDailySC * AVG_DAYS_PER_YEAR).toFixed(2) + ' SC' : 'N/A';
  const yearlyMaxSC = totalMaxDailySC !== undefined ? (totalMaxDailySC * AVG_DAYS_PER_YEAR).toFixed(2) + ' SC' : 'N/A';

  return (
    <TooltipProvider delayDuration={300}>
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

        {(totalMinDailySC !== undefined && totalMaxDailySC !== undefined) && (
          <Card className="flex-1 min-w-[150px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <CardContent className="p-4 cursor-help">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Daily SC Range</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(totalMinDailySC, true)} - {formatCurrency(totalMaxDailySC, true)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </TooltipTrigger>
              <TooltipContent>
                <p>Monthly Estimate: {monthlyMinSC} - {monthlyMaxSC}</p>
                <p>Yearly Estimate: {yearlyMinSC} - {yearlyMaxSC}</p>
              </TooltipContent>
            </Tooltip>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
} 