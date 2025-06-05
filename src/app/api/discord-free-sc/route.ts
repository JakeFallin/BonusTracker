import { NextResponse } from 'next/server';

// Define the expected structure of a single message
interface DiscordMessage { // Renamed from ScrapedMessage for clarity
  id: string;
  content: string;
  author_username?: string;
  timestamp: string;
  // Add any other relevant fields you expect, e.g., attachments, embeds
}

// Interface for the parameters passed to the fetch function
interface FetchDiscordMessagesParams {
  guildId: string; // Kept for consistency, though not directly used in the Discord API message fetch URL
  channelId: string;
  apiKey: string; // This is the Bot Token
}

// Function to fetch messages from a specific Discord channel
async function fetchLatestDiscordMessages(
  params: FetchDiscordMessagesParams
): Promise<DiscordMessage[]> {
  const { channelId, apiKey } = params;
  const endpoint = `https://discord.com/api/v9/channels/${channelId}/messages?limit=5`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": `${apiKey}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from Discord API (Channel: ${channelId}):`, response.status, errorText);
      throw new Error(`Failed to fetch from Discord API (Channel: ${channelId}): ${response.status} - ${errorText}`);
    }

    const data: DiscordMessage[] = await response.json();
    
    if (Array.isArray(data)) {
        return data;
    }
    
    console.warn(`Unexpected response structure from Discord API (Channel: ${channelId}):`, data);
    return []; 

  } catch (error) {
    console.error(`Error calling Discord API endpoint (Channel: ${channelId}):`, error);
    throw error; 
  }
}

// GET handler for the Free SC feed
export async function GET() {
  const GUILD_ID = process.env.GUILD_ID; // Guild ID is the same for both feeds
  const FREE_SC_CHANNEL_ID = process.env.FREE_SC_CHANNEL_ID; // Specific channel for Free SC
  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Bot token is the same

  if (!GUILD_ID || !FREE_SC_CHANNEL_ID || !DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: "Server configuration error: Missing Discord API details for Free SC. Ensure GUILD_ID, FREE_SC_CHANNEL_ID, and DISCORD_BOT_TOKEN are set." },
      { status: 500 }
    );
  }

  try {
    const messages = await fetchLatestDiscordMessages({
      guildId: GUILD_ID,
      channelId: FREE_SC_CHANNEL_ID, // Use the Free SC channel ID
      apiKey: DISCORD_BOT_TOKEN,
    });
    return NextResponse.json(messages);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch Free SC Discord updates";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 