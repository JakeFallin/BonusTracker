import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold">Casino Not Found</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        We couldn&apos;t find the casino you&apos;re looking for. It may have been removed or the URL might be incorrect.
      </p>
      <Button asChild>
        <Link href="/casinos">Browse All Casinos</Link>
      </Button>
    </div>
  );
} 