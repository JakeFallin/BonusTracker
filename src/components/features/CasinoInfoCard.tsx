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
import { dailySC } from '@/lib/dailySC';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CasinoInfoCardProps {
  casino: Casino;
  initiallySaved?: boolean;
  viewMode?: 'full' | 'condensed';
}

export function CasinoInfoCard({ 
  casino, 
  initiallySaved = false, 
  viewMode = 'full'
}: CasinoInfoCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(initiallySaved);

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
        if (originalSavedState) {
           setSaved(true);
        }
        toast.error('Failed to update saved status');
      }
    } catch (error) {
      if (originalSavedState) {
        setSaved(true);
      }
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
                <Button asChild size="default">
                  <a href={signupLinks[casino.slug as keyof typeof signupLinks]} target="_blank" rel="noopener noreferrer">
                    Sign Up
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {viewMode === 'full' && (
                  <>
                    <Badge variant="secondary" className="text-xs">
                      Tier {Math.ceil(casino.rating)}
                    </Badge>
                    <span>•</span>
                  </>
                )}
                <span>{casino.rating.toFixed(1)} User Rating</span>
                <span>•</span>
                <span>{dailySC[casino.slug as keyof typeof dailySC]} Daily Free SC</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions (conditionally rendered) */}
          {viewMode === 'full' && (
            <div className="flex flex-shrink-0 items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={`/casinos/${casino.slug}`}>Details</Link>
              </Button>
              <Button
                variant={displaySavedState ? "secondary" : "ghost"}
                size="sm"
                onClick={handleSaveCasino}
                disabled={isSaving || displaySavedState}
              >
                {displaySavedState ? 'Saved' : 'Add to My Casinos'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 