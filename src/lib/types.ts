export interface BestGameItem {
  name: string;
  rtp: string; // Representing RTP as a string, e.g., "96.5%" or "Variable"
}

export interface Casino {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  tier: string;
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
  bestGames?: string[]; // New type - array of strings
  dailyMinSc?: number;
  dailyMaxSc?: number;
  reviewId?: string;
  userRating?: number; // Optional: User's specific rating for this casino in their list
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

export interface DailySCValue {
  min: number;
  max: number;
}

export interface CasinoSite {
  name: string;
  slug: string;
  logoUrl: string;
  promoImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tags: string[];
  tier: string;
  bonusInfo: string;
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  gamesCount?: number;
  liveChatSupport?: boolean;
  phoneSupport?: boolean;
  emailSupport?: boolean;
  faqLink?: string;
  withdrawalMethods?: string[];
  withdrawalSpeed?: string;
  establishedYear?: number;
  jurisdiction?: string;
  softwareProviders?: string[];
  mobileCompatibility?: string[];
  promotions?: Promotion[];
  userRating?: number; // This can be an aggregate rating
  numberOfReviews?: number;
  averageRTP?: string;
  termsAndConditionsLink?: string;
  affiliateLink?: string;
  bestGames?: string[]; // New type - array of strings
  socialMediaLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  welcomeBonus?: string;
  wageringRequirements?: string;
  minDeposit?: string;
  minWithdrawal?: string;
  paymentMethods?: string[];
  restrictedCountries?: string[];
  customerSupportChannels?: string[];
  responsibleGamingFeatures?: string[];
  loyaltyProgramDetails?: string;
  supportedLanguages?: string[];
  siteSpeed?: string;
  securityMeasures?: string[];
}

export interface Promotion {
  // ... existing code ...
}

// Example usage (will be in dailySC.ts or similar)
// export const dailySCData: { [key: string]: DailySCValue } = {
//   'someCasino': { min: 1, max: 1.5 },
// }; 