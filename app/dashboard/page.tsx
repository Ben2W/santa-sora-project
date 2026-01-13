import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getUserGifts } from '@/lib/redis';
import GiftCard from '@/components/GiftCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null; // Middleware should handle this
  }

  const gifts = await getUserGifts(userId);

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-festive text-4xl text-christmas-gold mb-2">
              Your Gift Tags
            </h1>
            <p className="text-white/70">
              {gifts.length === 0
                ? "You haven't created any Santa videos yet"
                : `${gifts.length} magical QR code${gifts.length === 1 ? '' : 's'} ready to spread joy`}
            </p>
          </div>

          <Link
            href="/create"
            className="btn-festive px-6 py-3 rounded-full text-white font-semibold inline-flex items-center justify-center gap-2"
          >
            <span>➕</span>
            Create New Gift
          </Link>
        </div>

        {/* Grid of gifts */}
        {gifts.length === 0 ? (
          <div className="card-frost p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="font-festive text-2xl text-christmas-gold mb-2">
              No Gifts Yet!
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Create your first personalized Santa video and watch the holiday
              magic come to life.
            </p>
            <Link
              href="/create"
              className="btn-festive px-8 py-4 rounded-full text-white font-bold inline-flex items-center justify-center gap-2"
            >
              <span>🎅</span>
              Create Your First Gift
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gifts
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
          </div>
        )}

        {/* Tips section */}
        {gifts.length > 0 && (
          <div className="mt-12 card-frost p-6">
            <h3 className="font-festive text-xl text-christmas-gold mb-4">
              🖨️ How to Use Your QR Codes
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-white/70 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-1">1. Download</h4>
                <p>
                  Click on any gift to view details and download the QR code
                  image.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">2. Print</h4>
                <p>
                  Print the QR code on paper or a sticker. Works great on gift
                  tags!
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">3. Attach</h4>
                <p>
                  Tape or tie the QR code to your wrapped gift. Magic awaits!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
