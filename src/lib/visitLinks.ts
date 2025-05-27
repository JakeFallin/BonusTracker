export const visitLinks = {
  'crowncoins': 'https://crowncoinscasino.com',
  'realprize': 'https://www.realprize.com',
  'pulsz': 'https://www.pulsz.com',
  'wow-vegas': 'https://www.wowvegas.com',
  'casino-click': 'https://www.casinoclick.com',
  'high5': 'https://www.high5casino.com',
  'modo': 'https://modo.us',
  'stake': 'https://stake.us',
  'jackpota': 'https://www.jackpota.com',
  'zula': 'https://www.zulacasino.com'
  // Add other casino slugs and their official website URLs here
} as const;

export type CasinoSlug = keyof typeof visitLinks; 