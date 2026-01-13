import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative elements */}
          <div className="mb-6 flex justify-center gap-4 text-4xl">
            <span className="star" style={{ animationDelay: '0s' }}>
              ⭐
            </span>
            <span className="star" style={{ animationDelay: '0.5s' }}>
              ✨
            </span>
            <span className="star" style={{ animationDelay: '1s' }}>
              ⭐
            </span>
          </div>

          <h1 className="font-festive text-5xl md:text-7xl text-christmas-gold mb-6 drop-shadow-lg">
            Santa&apos;s Video Magic
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto">
            Create personalized Santa Claus videos for your gifts with AI-powered magic!
          </p>

          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Generate a custom video, get a festive QR code, print it, and stick it on your gift.
            When they scan it - Santa delivers a magical message!
          </p>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card-frost p-6">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-festive text-xl text-christmas-gold mb-2">
                Tell Santa
              </h3>
              <p className="text-white/70 text-sm">
                Enter the gift name, recipient, and any jokes for Santa to include
              </p>
            </div>

            <div className="card-frost p-6">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="font-festive text-xl text-christmas-gold mb-2">
                AI Magic
              </h3>
              <p className="text-white/70 text-sm">
                Sora AI creates a personalized Santa video just for your gift
              </p>
            </div>

            <div className="card-frost p-6">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-festive text-xl text-christmas-gold mb-2">
                Scan & Play
              </h3>
              <p className="text-white/70 text-sm">
                Print the festive QR code and watch the magic unfold when scanned
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedIn>
              <Link
                href="/create"
                className="btn-festive px-8 py-4 rounded-full text-white font-bold text-lg inline-flex items-center justify-center gap-2"
              >
                <span>🎅</span>
                Create Your First Gift
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>🎄</span>
                View My Gifts
              </Link>
            </SignedIn>
            <SignedOut>
              <Link
                href="/waitlist"
                className="btn-festive px-8 py-4 rounded-full text-white font-bold text-lg inline-flex items-center justify-center gap-2"
              >
                <span>🎅</span>
                Join the Waitlist
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                Already have access? Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-festive text-4xl text-christmas-gold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: '✍️',
                title: 'Enter Details',
                desc: "What's the gift? Who's it for? Any jokes?",
              },
              {
                step: 2,
                icon: '🤖',
                title: 'AI Creates',
                desc: 'Santa records a personalized video message',
              },
              {
                step: 3,
                icon: '🖨️',
                title: 'Print QR',
                desc: 'Download and print your festive QR code',
              },
              {
                step: 4,
                icon: '🎉',
                title: 'Surprise!',
                desc: 'They scan, Santa speaks, magic happens!',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-christmas-red flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <div className="text-christmas-gold font-bold mb-1">
                  Step {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-white/50 text-sm">
        <p>Made with holiday cheer 🎄 Powered by Sora AI & Replicate</p>
      </footer>
    </div>
  );
}
