import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="card-frost p-12 text-center max-w-md">
        <div className="text-6xl mb-4">🎅❓</div>
        <h1 className="font-festive text-4xl text-christmas-gold mb-4">
          Ho Ho... Uh Oh!
        </h1>
        <p className="text-white/70 mb-8">
          Santa couldn&apos;t find what you&apos;re looking for. Maybe it got
          lost in the snow?
        </p>
        <Link
          href="/"
          className="btn-festive px-8 py-3 rounded-full text-white font-semibold inline-flex items-center justify-center gap-2"
        >
          <span>🏠</span>
          Return Home
        </Link>
      </div>
    </div>
  );
}
