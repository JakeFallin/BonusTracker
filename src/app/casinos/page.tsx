'use client'; // Make this a client component

import { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import { CasinoInfoCard } from '@/components/features/CasinoInfoCard';
import { mockCasinos as allCasinosData } from '@/lib/mockData'; // Rename for clarity
import { Casino } from '@/lib/types'; // Import Casino type
// We need to pass session and savedCasinoIds as props or fetch client-side if they change frequently
// For now, assuming they are relatively static for the initial load for simplicity
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/db';

// UI Components (will be used later)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define props interface for CasinosPage
interface CasinosPageProps {
  //initialSavedCasinoIds?: string[]; // Optional prop
}

// Define the order of tiers for sorting
const tierOrder: { [key: string]: number } = {
  'Fantastic': 0, // Was S+👑
  'Excellent': 1, // New tier, for S+ (no casinos assigned yet)
  'Great': 2,     // Was S
  'Solid': 3,     // Was A
  'Unproven': 4,   // Was B, also for 🥚 and ?
};

export default function CasinosPage({ /* initialSavedCasinoIds */ }: CasinosPageProps) {
  // const session = await getServerSession(authOptions); // Cannot use await in client component
  // let savedCasinoIds: string[] = initialSavedCasinoIds; // Use prop

  // TODO: Re-implement savedCasinoIds logic if needed on client or pass as prop
  const initialSavedCasinoIds: string[] = []; // Placeholder

  const [filteredCasinos, setFilteredCasinos] = useState<Casino[]>(allCasinosData);
  // Default sort by tier, highest to lowest
  const [sortOption, setSortOption] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'tier', order: 'desc' });
  const [activeFeatureFilters, setActiveFeatureFilters] = useState<string[]>([]);
  const [activePaymentMethodFilters, setActivePaymentMethodFilters] = useState<string[]>([]);
  const [activeGameFilters, setActiveGameFilters] = useState<string[]>([]);

  const uniqueFeatures = useMemo(() => {
    const all = allCasinosData.flatMap(c => c.features);
    return Array.from(new Set(all)).sort();
  }, []); // allCasinosData is stable now

  const uniquePaymentMethods = useMemo(() => {
    const all = allCasinosData.flatMap(c => c.paymentMethods);
    return Array.from(new Set(all)).sort();
  }, []);

  const uniqueGames = useMemo(() => {
    const all = allCasinosData.flatMap(c => c.games);
    return Array.from(new Set(all)).sort();
  }, []);

  useEffect(() => {
    let casinos = [...allCasinosData];

    // Apply feature filters
    if (activeFeatureFilters.length > 0) {
      casinos = casinos.filter(c => activeFeatureFilters.every(filter => c.features.includes(filter)));
    }

    // Apply payment method filters
    if (activePaymentMethodFilters.length > 0) {
      casinos = casinos.filter(c => activePaymentMethodFilters.every(filter => c.paymentMethods.includes(filter)));
    }

    // Apply game filters
    if (activeGameFilters.length > 0) {
      casinos = casinos.filter(c => activeGameFilters.every(filter => c.games.includes(filter)));
    }

    // Apply sorting
    if (sortOption.field === 'tier') {
      casinos.sort((a, b) => {
        const tierAValue = tierOrder[a.tier] ?? 99; // Lower value is better tier
        const tierBValue = tierOrder[b.tier] ?? 99;
        let comparison = 0;

        if (sortOption.order === 'desc') { // High to Low (e.g., S+👑, S, A, B, ?)
          comparison = tierAValue - tierBValue;
        } else { // Ascending: Low to High (e.g., ?, B, A, S, S+👑)
          comparison = tierBValue - tierAValue;
        }
        
        if (comparison !== 0) return comparison;
        return a.name.localeCompare(b.name); // Secondary sort by name
      });
    } else if (sortOption.field === 'name') {
      casinos.sort((a, b) => {
        if (a.name < b.name) return sortOption.order === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOption.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    // TODO: Add sorting for welcomeBonus.amount if feasible

    setFilteredCasinos(casinos);
  }, [sortOption, activeFeatureFilters, activePaymentMethodFilters, activeGameFilters]);

  // Handlers for multi-select dropdowns
  const createToggleHandler = useCallback((setter: React.Dispatch<React.SetStateAction<string[]>>, currentValues: string[]) => (value: string) => {
    setter(currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value]);
  }, []);

  const handleFeatureToggle = useMemo(() => createToggleHandler(setActiveFeatureFilters, activeFeatureFilters), [createToggleHandler, activeFeatureFilters]);
  const handlePaymentMethodToggle = useMemo(() => createToggleHandler(setActivePaymentMethodFilters, activePaymentMethodFilters), [createToggleHandler, activePaymentMethodFilters]);
  const handleGameToggle = useMemo(() => createToggleHandler(setActiveGameFilters, activeGameFilters), [createToggleHandler, activeGameFilters]);

  const handleClearFilters = () => {
    setActiveFeatureFilters([]);
    setActivePaymentMethodFilters([]);
    setActiveGameFilters([]);
  };

  const areAnyFiltersActive = activeFeatureFilters.length > 0 || activePaymentMethodFilters.length > 0 || activeGameFilters.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-center">Casino Info</h1>
        <p className="text-lg text-muted-foreground text-center">
          Browse our curated list of top-rated sweepstakes casinos. Compare tiers,
          features, and user reviews to find your perfect match.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Please note that the sign up links may contain affiliate links.
        </p>
      </div>

      {/* Filters and Sorting Controls */}
      <div className="mb-8 p-4 border rounded-lg bg-card flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
          <Label className="font-semibold">Sort by:</Label>
          <Select
            value={`${sortOption.field}-${sortOption.order}`}
            onValueChange={(value: string) => {
              const [field, order] = value.split('-');
              setSortOption({ field, order: order as 'asc' | 'desc' });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tier-desc">Tier (High to Low)</SelectItem>
              <SelectItem value="tier-asc">Tier (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mt-4 md:mt-0">
          <Label className="font-semibold">Filter by:</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Features ({activeFeatureFilters.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueFeatures.map(feature => (
                <DropdownMenuCheckboxItem
                  key={feature}
                  checked={activeFeatureFilters.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Payment Methods ({activePaymentMethodFilters.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Payment Methods</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniquePaymentMethods.map(method => (
                <DropdownMenuCheckboxItem
                  key={method}
                  checked={activePaymentMethodFilters.includes(method)}
                  onCheckedChange={() => handlePaymentMethodToggle(method)}
                >
                  {method}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Games ({activeGameFilters.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Games</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueGames.map(game => (
                <DropdownMenuCheckboxItem
                  key={game}
                  checked={activeGameFilters.includes(game)}
                  onCheckedChange={() => handleGameToggle(game)}
                >
                  {game}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {areAnyFiltersActive && (
            <Button variant="ghost" onClick={handleClearFilters} className="ml-2">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Casino List */}
      {filteredCasinos.length > 0 ? (
        <div className="space-y-4">
          {filteredCasinos.map((casino) => (
            <CasinoInfoCard 
              key={casino.id} 
              casino={casino} 
              initiallySaved={initialSavedCasinoIds.includes(casino.id)} // Use placeholder for now
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-10">
          <p className="text-xl text-muted-foreground text-center">No casinos match your current filters.</p>
        </div>
      )}
    </div>
  );
} 