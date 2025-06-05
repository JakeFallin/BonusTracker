import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { SignInButton } from '@/components/auth/SignInButton';
import { navigationItems } from '@/lib/mockData';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">BonusTracker</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
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