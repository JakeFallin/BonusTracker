'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Casino } from '@/lib/types';
import { signupLinks } from '@/lib/signupLinks';
import { Gamepad2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CasinoInfoCardProps {
  casino: Casino;
  initiallySaved?: boolean;
  viewMode?: 'full' | 'condensed';
}

const tierColorMap: Record<string, string> = {
  "Fantastic": "bg-purple-200 text-purple-800 border-purple-300 dark:bg-purple-700 dark:text-purple-100 dark:border-purple-600",
  "Excellent": "bg-green-200 text-green-800 border-green-300 dark:bg-green-700 dark:text-green-100 dark:border-green-600",
  "Great": "bg-orange-200 text-orange-800 border-orange-300 dark:bg-orange-700 dark:text-orange-100 dark:border-orange-600",
  "Solid": "bg-blue-200 text-blue-800 border-blue-300 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-600",
  "Unproven": "bg-pink-200 text-pink-800 border-pink-300 dark:bg-pink-700 dark:text-pink-100 dark:border-pink-600",
};

export function CasinoInfoCard({ 
  casino, 
  initiallySaved = false, 
  viewMode = 'full'
}: CasinoInfoCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(initiallySaved);
  const [showBestGamesSection, setShowBestGamesSection] = useState(false);

  useEffect(() => {
    setSaved(initiallySaved);
  }, [initiallySaved]);

  const handleSaveCasino = async () => {
    if (status !== 'authenticated' || !session) {
      router.push('/auth/signin');
      return;
    }

    const originalSavedState = saved;
    if (saved) {
      setSaved(false);
    } else {
      // For adding, we might not want to optimistically update to 'Saved' immediately
      // if the button text changes based on `saved` state directly, as it would look like it saved instantly.
      // However, the current logic re-evaluates `displaySavedState` which handles this fine.
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/casinos/save', {
        method: originalSavedState ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ casinoId: casino.id }),
      });

      if (response.ok) {
        if (!originalSavedState) {
          setSaved(true);
        }
        toast.success(originalSavedState ? 'Casino removed from My Casinos' : 'Casino added to My Casinos');
        router.refresh();
      } else {
        setSaved(originalSavedState);
        toast.error('Failed to update saved status');
      }
    } catch (error) {
      setSaved(originalSavedState);
      console.error('Error saving casino:', error);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoggedIn = status === 'authenticated' && session;
  const displaySavedState = isLoggedIn && saved;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left side - Casino Info */}
          <div className="flex flex-1 gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={casino.logoUrl}
                alt={`${casino.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">{casino.name}</h3>
              </div>
              {/* Display Max Daily SC */}
              {typeof casino.dailyMaxSc === 'number' && casino.dailyMaxSc > 0 && (
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Max Daily SC: {casino.dailyMaxSc}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {viewMode === 'full' && (
                  <>
                    <Badge className={`text-xs ${tierColorMap[casino.tier] || 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'}`}>
                      {casino.tier}
                    </Badge>
                    <span>•</span>
                  </>
                )}
                {/* Show full daily SC range only in full view */}
                {viewMode === 'full' && (() => {
                  if (typeof casino.dailyMinSc === 'number' && typeof casino.dailyMaxSc === 'number' && (casino.dailyMinSc > 0 || casino.dailyMaxSc > 0)) {
                    const amountStr = casino.dailyMinSc === casino.dailyMaxSc ? `${casino.dailyMinSc} SC` : `${casino.dailyMinSc}-${casino.dailyMaxSc} SC`;
                    return <span>{amountStr} Daily Free SC</span>;
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>

          {/* Right side - Actions (conditionally rendered) */}
          {viewMode === 'full' && (
            
            <div className="flex flex-shrink-0 items-center gap-2 flex-wrap">
               <Button asChild variant="outline" size="sm" className="gap-1.5 bg-white text-gray-800 hover:bg-gray-100 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200">
                <a href={signupLinks[casino.slug as keyof typeof signupLinks]} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" /> Sign Up
                </a>
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
             
              <Button asChild variant="outline" size="sm">
                <Link href={`/casinos/${casino.slug}`}>Details</Link>
              </Button>
              <Button
                variant={
                  isLoggedIn 
                    ? (displaySavedState ? "secondary" : "default") 
                    : "ghost"
                }
                size="sm"
                onClick={handleSaveCasino}
                disabled={isSaving || !isLoggedIn}
                className={
                  isLoggedIn && !displaySavedState 
                    ? "bg-green-500 hover:bg-green-600 text-white border-transparent" 
                    : ""
                }
              >
                {isLoggedIn ? (displaySavedState ? 'Saved' : 'Add to My Casinos') : 'Add to My Casinos'}
              </Button>
            </div>
          )}
        </div>
        {viewMode === 'full' && showBestGamesSection && casino.bestGames && casino.bestGames.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-3">Top Games & RTP</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              {casino.bestGames.map((gameString, index) => (
                <div key={index}>
                  <span className="font-medium">{gameString}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 



