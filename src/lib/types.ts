export interface BestGameItem {
  name: string;
  rtp: string; // Representing RTP as a string, e.g., "96.5%" or "Variable"
}

export interface Casino {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  rating: number;
  welcomeBonus: {
    amount: string;
    description: string;
  };
  features: string[];
  pros: string[];
  cons: string[];
  games: string[];
  paymentMethods: string[];
  reviews: Review[];
  bestGames?: BestGameItem[]; // Optional array of best games
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NavigationItem {
  label: string;
  href: string;
} 