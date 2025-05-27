import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { SignInButton } from '@/components/auth/SignInButton';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">BonusTracker</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/casinos" className="transition-colors hover:text-foreground/80">
              Casinos
            </Link>
            <Link href="/guides" className="transition-colors hover:text-foreground/80">
              Guides
            </Link>
            <Link href="/reviews" className="transition-colors hover:text-foreground/80">
              Reviews
            </Link>
            <Link href="/my-casinos" className="transition-colors hover:text-foreground/80">
              My Casinos
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <SignInButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
} 