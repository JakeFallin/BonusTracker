import { DiscordSales } from '@/components/features/DiscordSales';

export default function DiscordSalesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Free Stuff is Great!</h1>
        <p className="text-lg text-muted-foreground">
        </p>
      </div>
      <DiscordSales />
    </div>
  );
} 