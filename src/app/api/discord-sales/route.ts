import { NextResponse } from 'next/server';

// This is an assumption, adjust it based on the actual API response
interface ScrapedMessage {
  id: string; // Or number, depending on the API
  content: string;
  author_username?: string; // Or author_id, author_name, etc.
  timestamp: string; // ISO 8601 date string typically
  // Add any other relevant fields you expect, e.g., attachments, embeds
}


interface FetchDiscordMessagesParams {
  guildId: string;
  channelId: string;
  apiKey: string;
}

async function fetchLatestDiscordMessages(
  params: FetchDiscordMessagesParams
): Promise<ScrapedMessage[]> {
  const { guildId, channelId, apiKey } = params;
  // Using Discord API v9, v10 is latest but v9 is often still used/stable
  const endpoint = `https://discord.com/api/v9/channels/${channelId}/messages?limit=5`; // Changed limit to 50

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        // "Content-Type": "application/json", // Not strictly necessary for GET usually
        "Authorization": `${apiKey}` // Corrected typo
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from Discord API:", response.status, errorText);
      throw new Error(`Failed to fetch from Discord API: ${response.status} - ${errorText}`);
    }

    const data: ScrapedMessage[] = await response.json(); // Discord API returns an array of message objects directly
    
    if (Array.isArray(data)) {
        return data;
    }
    
    console.warn("Unexpected response structure from Discord API:", data);
    return []; 

  } catch (error) {
    console.error("Error calling Discord API endpoint:", error);
    throw error; 
  }
}

export async function GET(request: Request) {
  const GUILD_ID = process.env.GUILD_ID;
  const CHANNEL_ID = process.env.CHANNEL_ID;
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  if (!GUILD_ID || !CHANNEL_ID || !DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: "Server configuration error: Missing Discord API details. Ensure GUILD_ID, CHANNEL_ID, and DISCORD_BOT_TOKEN are set." },
      { status: 500 }
    );
  }

  try {
    const messages = await fetchLatestDiscordMessages({
      guildId: GUILD_ID,
      channelId: CHANNEL_ID,
      apiKey: DISCORD_BOT_TOKEN,
    });
    return NextResponse.json(messages);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch Discord updates";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 