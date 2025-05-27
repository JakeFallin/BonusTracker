export const dailySC = {
  'crowncoins': '1 SC',
  'realprize': '0.3 SC',
  'pulsz': '1 SC',
  'wow-vegas': '0.3-1+ SC',
  'casino-click': '10 Free Spins',
  'high5': '0.5 SC',
  'modo': '1 SC',
  'stake': '1 SC',
  'jackpota': '0.25-0.5 SC',
  'zula': '0.5-1.5 SC'
} as const;

export type CasinoSlug = keyof typeof dailySC; 