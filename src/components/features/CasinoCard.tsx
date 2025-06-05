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
import { Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTimers } from '@/hooks/useTimers';

interface CasinoCardProps {
  casino: Casino;
  showTimer?: boolean;
  isSaved?: boolean;
}

export function CasinoCard({ casino, showTimer = false, isSaved = false }: CasinoCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [showTimerSection, setShowTimerSection] = useState(false);
  const [timerHours, setTimerHours] = useState(24);
  const { activeTimers, addTimer, removeTimer } = useTimers();
  const timer = activeTimers.find(t => t.casinoId === casino.id);
  const [timeLeft, setTimeLeft] = useState<number | null>(timer ? timer.endTime - Date.now() : null);

  const handleSaveCasino = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch('/api/casinos/save', {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ casinoId: casino.id }),
      });

      if (response.ok) {
        setSaved(!saved);
        toast.success(saved ? 'Casino removed from My Casinos' : 'Casino added to My Casinos');
        router.refresh();
      } else {
        toast.error('Failed to save casino');
      }
    } catch (error) {
      console.error('Error saving casino:', error);
      toast.error('An error occurred while saving the casino');
    } finally {
      setIsSaving(false);
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

  // Update timer every second
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

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left side - Casino Info */}
          <div className="flex gap-4">
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
                <Badge variant="secondary" className="text-xs">
                  Tier {casino.tier}
                </Badge>
                <span>•</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {showTimer && (
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
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={`/casinos/${casino.slug}`}>Details</Link>
            </Button>
            {showTimer ? (
              isSaved ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={handleSaveCasino}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              ) : (
                <Button
                  variant={saved ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handleSaveCasino}
                  disabled={isSaving}
                >
                  {saved ? 'Saved' : 'Add to My Casinos'}
                </Button>
              )
            ) : (
              <Button
                variant={saved ? "secondary" : "ghost"}
                size="sm"
                onClick={handleSaveCasino}
                disabled={isSaving}
              >
                {saved ? 'Saved' : 'Add to My Casinos'}
              </Button>
            )}
          </div>
        </div>

        {/* Timer Section */}
        {showTimer && showTimerSection && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="timer-hours">Timer Duration (hours)</Label>
                <Input
                  id="timer-hours"
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
      </CardContent>
    </Card>
  );
} 