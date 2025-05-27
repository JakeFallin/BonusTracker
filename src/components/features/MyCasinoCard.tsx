'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Casino, BestGameItem } from '@/lib/types';
import { visitLinks } from '@/lib/visitLinks';
import { dailySC as globalDailySC } from '@/lib/dailySC';
import { Clock, Trash2, ChevronDown, ChevronUp, DollarSign, Save, ExternalLink, Star, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimers } from '@/hooks/useTimers';

interface MyCasinoCardProps {
  casino: Casino;
  initialBalance?: number;
  initialDepositTotal?: number;
  initialDailyScValue?: number;
  initialLastVisited?: Date | null;
  initialRating?: number;
}

// Helper function to parse SC value from string
const parseScValue = (scString: string | undefined): number => {
  if (!scString) return 1; // Default if undefined
  const match = scString.match(/(\d*\.?\d+)/); // Matches integers or decimals
  return match ? parseFloat(match[1]) : 1; // Default to 1 if no number found
};

export function MyCasinoCard({ 
  casino, 
  initialBalance = 0, 
  initialDepositTotal = 0, 
  initialDailyScValue, 
  initialLastVisited = null,
  initialRating,
}: MyCasinoCardProps) {
  const router = useRouter();
  const [showTimerSection, setShowTimerSection] = useState(false);
  const [showBestGamesSection, setShowBestGamesSection] = useState(false);
  const [timerHours, setTimerHours] = useState(24);
  const { activeTimers, addTimer, removeTimer } = useTimers();
  const timer = activeTimers.find(t => t.casinoId === casino.id);
  const [timeLeft, setTimeLeft] = useState<number | null>(timer ? timer.endTime - Date.now() : null);

  const defaultScValue = initialDailyScValue !== undefined 
    ? initialDailyScValue 
    : parseScValue(globalDailySC[casino.slug as keyof typeof globalDailySC]);

  const [showAmountsSection, setShowAmountsSection] = useState(false);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [depositTotal, setDepositTotal] = useState<number>(initialDepositTotal);
  const [editableDailySC, setEditableDailySC] = useState<number>(defaultScValue);
  const [isSavingAmounts, setIsSavingAmounts] = useState(false);
  const [lastVisited, setLastVisited] = useState<Date | null>(initialLastVisited);
  const [ratingToDisplay, setRatingToDisplay] = useState<number>(initialRating !== undefined ? initialRating : casino.rating);

  useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);

  useEffect(() => {
    setDepositTotal(initialDepositTotal);
  }, [initialDepositTotal]);

  useEffect(() => {
    // Update editableDailySC if initialDailyScValue prop changes or if it was undefined and needs parsing
    const newDefaultSc = initialDailyScValue !== undefined
      ? initialDailyScValue
      : parseScValue(globalDailySC[casino.slug as keyof typeof globalDailySC]);
    setEditableDailySC(newDefaultSc);
  }, [initialDailyScValue, casino.slug]);

  useEffect(() => {
    setLastVisited(initialLastVisited);
  }, [initialLastVisited]);

  useEffect(() => {
    setRatingToDisplay(initialRating !== undefined ? initialRating : casino.rating);
  }, [initialRating, casino.rating]);

  const handleRemoveCasino = async () => {
    try {
      const response = await fetch('/api/casinos/save', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ casinoId: casino.id }),
      });

      if (response.ok) {
        toast.success('Casino removed from My Casinos');
        router.refresh();
      } else {
        toast.error('Failed to remove casino');
      }
    } catch (error) {
      console.error('Error removing casino:', error);
      toast.error('An error occurred while removing the casino');
    }
  };

  const handleStartTimer = () => {
    addTimer(casino.id, timerHours);
    setTimeLeft(timerHours * 60 * 60 * 1000);
    toast.success(`Timer set for ${timerHours} hours`);
  };

  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          removeTimer(casino.id);
          toast.success('Timer completed!');
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, casino.id, removeTimer]);

  const handleSaveAmounts = async () => {
    setIsSavingAmounts(true);
    try {
      const response = await fetch('/api/casinos/save', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          casinoId: casino.id,
          balance,
          depositTotal,
          dailyScValue: editableDailySC,
        }),
      });
      if (response.ok) {
        toast.success('Amounts saved successfully!');
        router.refresh(); // Refresh to ensure data consistency if needed elsewhere
      } else {
        const errorData = await response.text();
        toast.error(`Failed to save amounts: ${response.status} ${errorData || ''}`);
      }
    } catch (error) {
      console.error('Error saving amounts:', error);
      toast.error('An error occurred while saving amounts.');
    } finally {
      setIsSavingAmounts(false);
    }
  };

  const handleVisitSiteAndRecordTime = async () => {
    // Open link in new tab
    const url = visitLinks[casino.slug as keyof typeof visitLinks];
    window.open(url, '_blank', 'noopener,noreferrer');

    // Record visit time
    try {
      const response = await fetch('/api/casinos/save', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ casinoId: casino.id }),
      });

      if (response.ok) {
        const updatedCasino = await response.json();
        setLastVisited(new Date(updatedCasino.lastVisited)); // Update state from response
        toast.success('Visit time recorded!');
        // router.refresh(); // Optional: refresh if other components need this immediately
      } else {
        toast.error('Failed to record visit time.');
      }
    } catch (error) {
      console.error('Error recording visit time:', error);
      toast.error('An error occurred while recording visit time.');
    }
  };

  const formatLastVisited = () => {
    if (!lastVisited) return 'Never';
    
    const now = new Date();
    const visitedDate = new Date(lastVisited);
    const diffInMilliseconds = now.getTime() - visitedDate.getTime();
    const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (hours < 1) {
      return 'Less than an hour ago';
    }
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left side - Casino Info */}
          <div className="flex gap-4 flex-grow">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={casino.logoUrl}
                alt={`${casino.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1 flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{casino.name}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground flex-wrap">
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Star className="h-3 w-3" /> 
                  <span>{ratingToDisplay.toFixed(1)}</span>
                </Badge>
                <span>•</span>
                <span>{globalDailySC[casino.slug as keyof typeof globalDailySC]} Daily Free SC</span>
                <span>•</span>
                <span className="text-xs text-foreground">
                 Visited: {formatLastVisited()}
               </span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Visit Button - no longer needs its own inner div */}
            <Button 
              onClick={handleVisitSiteAndRecordTime} 
              variant="outline" 
              size="sm" 
              className="gap-1.5 bg-white text-gray-800 hover:bg-gray-100 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Visit
            </Button>

            {/* Best Games Button (New) */}
            {casino.bestGames && casino.bestGames.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowBestGamesSection(!showBestGamesSection)}
              >
                <Gamepad2 className="h-4 w-4" />
                <span>Best Games</span>
                {showBestGamesSection ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowAmountsSection(!showAmountsSection)}
            >
              <DollarSign className="h-4 w-4" />
              <span>Amounts</span>
              {showAmountsSection ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowTimerSection(!showTimerSection)}
            >
              <Clock className="h-4 w-4" />
              <span>Timer</span>
              {showTimerSection ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/casinos/${casino.slug}`}>Details</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleRemoveCasino}
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </div>
        </div>

        {/* Amounts Section */}
        {showAmountsSection && (
          <div className="mt-4 border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`balance-${casino.id}`}>Balance</Label>
                <Input
                  id={`balance-${casino.id}`}
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  className="w-full"
                  placeholder="0"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`deposit-total-${casino.id}`}>Deposit Total</Label>
                <Input
                  id={`deposit-total-${casino.id}`}
                  type="number"
                  value={depositTotal}
                  onChange={(e) => setDepositTotal(parseFloat(e.target.value) || 0)}
                  className="w-full"
                  placeholder="0"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`daily-sc-${casino.id}`}>Daily SC Value</Label>
                <Input
                  id={`daily-sc-${casino.id}`}
                  type="number"
                  value={editableDailySC}
                  onChange={(e) => setEditableDailySC(parseFloat(e.target.value) || 0)}
                  className="w-full"
                  placeholder="1"
                  step="any"
                />
              </div>
            </div>
            <Button onClick={handleSaveAmounts} disabled={isSavingAmounts} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              {isSavingAmounts ? 'Saving...' : 'Save Amounts'}
            </Button>
          </div>
        )}

        {/* Timer Section */}
        {showTimerSection && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor={`timer-hours-${casino.id}`}>Timer Duration (hours)</Label>
                <Input
                  id={`timer-hours-${casino.id}`}
                  type="number"
                  min="1"
                  max="168"
                  value={timerHours}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setTimerHours(Math.max(1, Math.min(168, parseInt(e.target.value) || 24)))
                  }
                  className="w-32"
                />
              </div>
              <Button onClick={handleStartTimer} disabled={timeLeft !== null}>
                Start Timer
              </Button>
            </div>
            {timeLeft !== null && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-lg font-semibold">
                    Time Remaining: {formatTimeLeft(timeLeft)}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      removeTimer(casino.id);
                      setTimeLeft(null);
                      toast.success('Timer deleted');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Best Games Section (New) */}
        {showBestGamesSection && casino.bestGames && casino.bestGames.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-3">Top Games & RTP</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              {casino.bestGames.map((game, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{game.name}</span>
                  <span className="text-muted-foreground">{game.rtp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 