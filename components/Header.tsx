'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="relative z-10 px-4 py-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🎅</span>
          <span className="font-festive text-2xl text-christmas-gold">
            Santa&apos;s Video Magic
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              href="/create"
              className="btn-festive px-4 py-2 rounded-full text-white font-semibold text-sm"
            >
              Create Gift
            </Link>
            <Link
              href="/dashboard"
              className="text-white/80 hover:text-white transition-colors"
            >
              My Gifts
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 border-2 border-christmas-gold',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-festive px-6 py-2 rounded-full text-white font-semibold">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
