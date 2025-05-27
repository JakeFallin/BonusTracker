'use client';

import { CasinoInfoCard } from '@/components/features/CasinoInfoCard';
import type { Casino } from '@/lib/types'; // Import Casino type
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from 'react'; // Import React for useRef

interface HomePageCarouselProps {
  casinos: Casino[];
  savedCasinoIds: string[];
}

export function HomePageCarousel({ casinos, savedCasinoIds }: HomePageCarouselProps) {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false, // Continue autoplay after user interaction
      stopOnMouseEnter: false, // Explicitly set to false, autoplay continues on mouse enter
      playOnInit: true, // Explicitly ensure it plays on initialization (default is true)
    })
  );

  return (
    <Carousel 
      opts={{ 
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]} // Pass the plugin instance
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {casinos.map((casino, index) => (
          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <CasinoInfoCard 
                casino={casino} 
                initiallySaved={savedCasinoIds.includes(casino.id)}
                viewMode="condensed"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-black" />
      <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-black" />
    </Carousel>
  );
} 