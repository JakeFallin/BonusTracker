'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { formatDistanceToNow, parse } from 'date-fns';
// All discord.js related imports and client setup should be removed from this client component.

interface DiscordMessage {
  id: string;
  content: string;
  author_username?: string;
  timestamp: string;
}

const REFRESH_COOLDOWN_SECONDS = 600; // 10 minutes

export function DiscordSales() {
  // State for Sales Feed
  const [salesMessages, setSalesMessages] = useState<DiscordMessage[]>([]);
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  // State for Free SC Feed
  const [freeScMessages, setFreeScMessages] = useState<DiscordMessage[]>([]);
  const [isFreeScLoading, setIsFreeScLoading] = useState(true);
  const [freeScError, setFreeScError] = useState<string | null>(null);

  // Shared state for Refresh Button
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const fetchSalesFeed = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh) setIsSalesLoading(true);
    setSalesError(null);
    try {
      const response = await fetch('/api/discord-sales');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data: DiscordMessage[] = await response.json();
      setSalesMessages(data);
    } catch (err) {
      setSalesError(err instanceof Error ? err.message : "An unknown error occurred fetching sales");
    } finally {
      if (!isManualRefresh) setIsSalesLoading(false);
    }
  }, []);

  const fetchFreeScFeed = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh) setIsFreeScLoading(true);
    setFreeScError(null);
    try {
      const response = await fetch('/api/discord-free-sc'); // New endpoint
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      const data: DiscordMessage[] = await response.json();
      setFreeScMessages(data);
    } catch (err) {
      setFreeScError(err instanceof Error ? err.message : "An unknown error occurred fetching Free SC updates");
    } finally {
      if (!isManualRefresh) setIsFreeScLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesFeed();
    fetchFreeScFeed();
  }, [fetchSalesFeed, fetchFreeScFeed]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      setIsRefreshDisabled(false);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRefresh = () => {
    if (isRefreshDisabled) return;
    // Set loading states for manual refresh if desired, or rely on individual fetcher loading states
    setIsSalesLoading(true);
    setIsFreeScLoading(true);
    fetchSalesFeed(true).finally(() => setIsSalesLoading(false));
    fetchFreeScFeed(true).finally(() => setIsFreeScLoading(false));
    setIsRefreshDisabled(true);
    setCountdown(REFRESH_COOLDOWN_SECONDS);
  };

  const renderMessageCard = (msg: DiscordMessage) => {
    let dateToShow = 'Invalid date';
    try {
      const parsedDate = new Date(msg.timestamp);
      if (isNaN(parsedDate.getTime())) { 
          const oldFormatDate = parse(msg.timestamp, 'dd/MM/yyyy, HH:mm:ss', new Date());
          if(!isNaN(oldFormatDate.getTime())) dateToShow = formatDistanceToNow(oldFormatDate, { addSuffix: true });
          else throw new Error('Invalid date format after multiple attempts');
      } else {
          dateToShow = formatDistanceToNow(parsedDate, { addSuffix: true });
      }
    } catch (e) {
      console.error("Error parsing date:", msg.timestamp, e);
    }

    // Remove Discord user mentions from the content
    let cleanedContent = msg.content.replace(/<@(?:!?|&)(\d+)>/g, ''); // Removes <@USER_ID>, <@!USER_ID>, <@&ROLE_ID>
    // Remove @everyone, @here, and other general @word mentions (not in email-like strings)
    cleanedContent = cleanedContent.replace(/\B(@(?:everyone|here))\b|\B@\w+/g, ''); 
    cleanedContent = cleanedContent.trim();

    return (
      <Card key={msg.id} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">
            {msg.author_username ? `From: ${msg.author_username}` : 'New Update'}
          </CardTitle>
          <CardDescription>
            Posted: {dateToShow}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap break-words">{cleanedContent}</p>
        </CardContent>
      </Card>
    );
  };

  // Combined loading state for the main refresh button animation
  const isAnyFeedLoadingManual = isSalesLoading || isFreeScLoading;

  return (
    <div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Sales Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Sales</h2>
          {isSalesLoading && salesMessages.length === 0 && (
            <div className="flex justify-center items-center min-h-[100px]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" /> <span className="ml-2">Loading Sales...</span>
            </div>
          )}
          {salesError && (
            <Alert variant="destructive" className="my-2">
              <AlertTitle>Error Loading Sales</AlertTitle>
              <AlertDescription>{salesError}</AlertDescription>
            </Alert>
          )}
          {salesMessages.length === 0 && !isSalesLoading && !salesError && (
            <div className="text-center py-4"><p className="text-muted-foreground">No sales messages found.</p></div>
          )}
          <div className="space-y-4">
            {salesMessages.map(renderMessageCard)}
          </div>
        </div>

        {/* Free SC Column */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Free SC</h2>
          {isFreeScLoading && freeScMessages.length === 0 && (
            <div className="flex justify-center items-center min-h-[100px]">
              <Loader2 className="h-6 w-6 animate-spin text-primary" /> <span className="ml-2">Loading Free SC...</span>
            </div>
          )}
          {freeScError && (
            <Alert variant="destructive" className="my-2">
              <AlertTitle>Error Loading Free SC</AlertTitle>
              <AlertDescription>{freeScError}</AlertDescription>
            </Alert>
          )}
          {freeScMessages.length === 0 && !isFreeScLoading && !freeScError && (
            <div className="text-center py-4"><p className="text-muted-foreground">No Free SC messages found.</p></div>
          )}
          <div className="space-y-4">
            {freeScMessages.map(renderMessageCard)}
          </div>
        </div>
      </div>
    </div>
  );
} 