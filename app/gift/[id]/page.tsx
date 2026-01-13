import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getGift } from '@/lib/redis';
import QRDisplay from '@/components/QRDisplay';
import GiftActions from './GiftActions';
import StatusPoller from './StatusPoller';

export const dynamic = 'force-dynamic';

interface GiftPageProps {
  params: Promise<{ id: string }>;
}

export default async function GiftPage({ params }: GiftPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  const gift = await getGift(id);

  if (!gift) {
    notFound();
  }

  // Check ownership
  if (gift.userId !== userId) {
    notFound();
  }

  const statusMessages = {
    pending: 'Your gift is in the queue...',
    generating_video: 'Santa is recording his message...',
    generating_qr: 'Creating your festive QR code...',
    ready: 'Your gift tag is ready!',
    error: 'Something went wrong with the magic.',
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <StatusPoller giftId={gift.id} currentStatus={gift.status} />
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
        >
          <span>←</span>
          Back to Dashboard
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - QR Code */}
          <div className="flex flex-col items-center">
            {gift.status === 'ready' && gift.qrCodeUrl ? (
              <QRDisplay qrCodeUrl={gift.qrCodeUrl} giftName={gift.giftName} />
            ) : (
              <div className="card-frost p-12 text-center w-full">
                {gift.status === 'error' ? (
                  <>
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="font-festive text-2xl text-christmas-red mb-2">
                      Generation Failed
                    </h2>
                    <p className="text-white/60 mb-4">
                      {gift.errorMessage || "Something went wrong. Please try again."}
                    </p>
                    <GiftActions giftId={gift.id} showRetry />
                  </>
                ) : (
                  <>
                    <div className="spinner w-16 h-16 mx-auto mb-4" />
                    <h2 className="font-festive text-2xl text-christmas-gold mb-2">
                      {statusMessages[gift.status]}
                    </h2>
                    <p className="text-white/60">
                      This may take 5-10 minutes. You can leave this page and
                      check back later.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div>
            <div className="card-frost p-6 mb-6">
              <h1 className="font-festive text-3xl text-christmas-gold mb-4">
                {gift.giftName}
              </h1>

              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-sm">Recipient</label>
                  <p className="text-white font-semibold">
                    {gift.recipientName}
                  </p>
                </div>

                {gift.jokes && (
                  <div>
                    <label className="text-white/50 text-sm">
                      Special Message/Jokes
                    </label>
                    <p className="text-white">{gift.jokes}</p>
                  </div>
                )}

                <div>
                  <label className="text-white/50 text-sm">Status</label>
                  <p className="text-white flex items-center gap-2">
                    {gift.status === 'ready' && (
                      <span className="w-2 h-2 rounded-full bg-christmas-green" />
                    )}
                    {(gift.status === 'generating_video' ||
                      gift.status === 'generating_qr') && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    )}
                    {gift.status === 'pending' && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    )}
                    {gift.status === 'error' && (
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                    {statusMessages[gift.status]}
                  </p>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Created</label>
                  <p className="text-white">
                    {new Date(gift.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {gift.status === 'ready' && (
              <div className="card-frost p-6">
                <h3 className="font-festive text-xl text-christmas-gold mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  {gift.videoUrl && (
                    <Link
                      href={`/play/${gift.id}`}
                      target="_blank"
                      className="block w-full bg-christmas-green hover:bg-christmas-green/90 text-white text-center py-3 rounded-full font-semibold transition-colors"
                    >
                      🎬 Preview Video
                    </Link>
                  )}

                  <GiftActions giftId={gift.id} />
                </div>
              </div>
            )}

            {/* Instructions */}
            {gift.status === 'ready' && (
              <div className="mt-6 card-frost p-6">
                <h3 className="font-festive text-xl text-christmas-gold mb-4">
                  📋 Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-white/70 text-sm">
                  <li>Download the QR code image</li>
                  <li>Print it on paper or a sticker</li>
                  <li>Cut it out (leave some border)</li>
                  <li>Attach to your wrapped gift</li>
                  <li>When recipient scans, magic happens!</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
