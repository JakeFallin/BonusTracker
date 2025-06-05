'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Casino } from '@/lib/types';
import { visitLinks } from '@/lib/visitLinks';
import { Trash2, ChevronDown, ChevronUp, DollarSign, Save, ExternalLink, Star, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MyCasinoCardProps {
  casino: Casino;
  initialBalance?: number;
  initialDepositTotal?: number;
  initialMinDailySc?: number;
  initialMaxDailySc?: number;
  initialLastVisited?: Date | null;
  initialRating?: number;
}

const tierColorMap: Record<string, string> = {
  "Fantastic": "bg-purple-200 text-purple-800 border-purple-300 dark:bg-purple-700 dark:text-purple-100 dark:border-purple-600",
  "Excellent": "bg-green-200 text-green-800 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600",
  "Great": "bg-orange-200 text-orange-800 border-orange-300 dark:bg-orange-700 dark:text-orange-100 dark:border-orange-600",
  "Solid": "bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600",
  "Unproven": "bg-pink-200 text-pink-800 border-pink-300 dark:bg-pink-700 dark:text-pink-100 dark:border-pink-600",
};

export function MyCasinoCard({ 
  casino, 
  initialBalance = 0, 
  initialDepositTotal = 0, 
  initialMinDailySc,
  initialMaxDailySc,
  initialLastVisited = null,
  initialRating,
}: MyCasinoCardProps) {
  const router = useRouter();
  const [showBestGamesSection, setShowBestGamesSection] = useState(false);

  
  const [editableMinDailySc, setEditableMinDailySc] = useState<number>(
    initialMinDailySc !== undefined ? initialMinDailySc : (casino.dailyMinSc ?? 0)
  );
  const [editableMaxDailySc, setEditableMaxDailySc] = useState<number>(
    initialMaxDailySc !== undefined ? initialMaxDailySc : (casino.dailyMaxSc ?? 0)
  );

  const [showAmountsSection, setShowAmountsSection] = useState(false);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [depositTotal, setDepositTotal] = useState<number>(initialDepositTotal);
  const [isSavingAmounts, setIsSavingAmounts] = useState(false);
  const [lastVisited, setLastVisited] = useState<Date | null>(initialLastVisited);
  const [userPersonalRating, setUserPersonalRating] = useState<number | undefined>(initialRating);

  useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);

  useEffect(() => {
    setDepositTotal(initialDepositTotal);
  }, [initialDepositTotal]);

  useEffect(() => {
    setEditableMinDailySc(
      initialMinDailySc !== undefined 
        ? initialMinDailySc 
        : (casino.dailyMinSc ?? 0)
    );
    setEditableMaxDailySc(
      initialMaxDailySc !== undefined
        ? initialMaxDailySc
        : (casino.dailyMaxSc ?? 0)
    );
  }, [initialMinDailySc, initialMaxDailySc, casino.slug, casino.dailyMinSc, casino.dailyMaxSc]);

  useEffect(() => {
    setLastVisited(initialLastVisited);
  }, [initialLastVisited]);

  useEffect(() => {
    setUserPersonalRating(initialRating);
  }, [initialRating]);

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
          dailyScMin: editableMinDailySc,
          dailyScMax: editableMaxDailySc,
        }),
      });
      if (response.ok) {
        toast.success('Amounts saved successfully!');
        router.refresh(); 
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
    const url = visitLinks[casino.slug as keyof typeof visitLinks];
    window.open(url, '_blank', 'noopener,noreferrer');
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
        setLastVisited(new Date(updatedCasino.lastVisited)); 
        toast.success('Visit time recorded!');
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

  const displayScText = (() => {
    const minSc = editableMinDailySc ?? 0;
    const maxSc = editableMaxDailySc ?? 0;

    if (minSc > 0 || maxSc > 0) {
      const amountStr = minSc === maxSc ? `${minSc} SC` : `${minSc}-${maxSc} SC`;
      return `${amountStr} Daily Free SC`;
    }
    return null;
  })();

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
                <Badge className={`text-xs ${tierColorMap[casino.tier] || 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'}`}>{casino.tier}</Badge>
                {displayScText && <span>{displayScText}</span>}
                {displayScText && <span>•</span>}
                <span className="text-xs text-foreground">Visited: {formatLastVisited()}</span>
                 {userPersonalRating !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-xs text-foreground flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" /> {userPersonalRating.toFixed(1)}/5
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleVisitSiteAndRecordTime} 
              variant="outline" 
              size="sm" 
              className="gap-1.5 bg-white text-gray-800 hover:bg-gray-100 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Visit
            </Button>

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
                <div className="space-y-2 mb-2">
                    <Label htmlFor={`min-daily-sc-${casino.id}`}>Min Daily SC</Label>
                    <Input
                    id={`min-daily-sc-${casino.id}`}
                    type="number"
                    value={editableMinDailySc}
                    onChange={(e) => setEditableMinDailySc(parseFloat(e.target.value) || 0)}
                    className="w-full"
                    placeholder="0"
                    step="any"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`max-daily-sc-${casino.id}`}>Max Daily SC</Label>
                    <Input
                    id={`max-daily-sc-${casino.id}`}
                    type="number"
                    value={editableMaxDailySc}
                    onChange={(e) => setEditableMaxDailySc(parseFloat(e.target.value) || 0)}
                    className="w-full"
                    placeholder="0"
                    step="any"
                    />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveAmounts} disabled={isSavingAmounts} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              {isSavingAmounts ? 'Saving...' : 'Save Amounts'}
            </Button>
          </div>
        )}

        {/* Best Games Section */}
        {showBestGamesSection && casino.bestGames && casino.bestGames.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-3">Top Games</h4>
            <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
              {casino.bestGames.map((gameText, index) => (
                <li key={index} className="text-foreground">
                  {gameText}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 