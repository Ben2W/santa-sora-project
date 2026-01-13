import { notFound } from 'next/navigation';
import { getGift } from '@/lib/redis';
import VideoPlayer from '@/components/VideoPlayer';

export const dynamic = 'force-dynamic';

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { id } = await params;
  const gift = await getGift(id);

  if (!gift) {
    return { title: 'Gift Not Found' };
  }

  return {
    title: `Santa's Message for ${gift.recipientName}`,
    description: `A special personalized video message from Santa Claus!`,
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { id } = await params;
  const gift = await getGift(id);

  if (!gift) {
    notFound();
  }

  if (gift.status !== 'ready' || !gift.videoUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-frost p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎅</div>
          <h1 className="font-festive text-3xl text-christmas-gold mb-4">
            Santa&apos;s Still Getting Ready!
          </h1>
          <p className="text-white/70 mb-6">
            {gift.status === 'error'
              ? "Oops! Something went wrong with Santa's magic. Please ask the gift giver to create a new video."
              : "Santa is still preparing your special message. Check back in a moment!"}
          </p>
          {gift.status !== 'error' && (
            <div className="spinner w-12 h-12 mx-auto" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center gap-2 text-3xl mb-4">
          <span>⭐</span>
          <span>🎄</span>
          <span>⭐</span>
        </div>
        <h1 className="font-festive text-4xl md:text-5xl text-christmas-gold mb-2">
          A Message From Santa!
        </h1>
        <p className="text-white/70">
          Special delivery for {gift.recipientName}
        </p>
      </div>

      {/* Video Player */}
      <VideoPlayer
        videoUrl={gift.videoUrl}
        recipientName={gift.recipientName}
        giftName={gift.giftName}
      />

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Made with holiday magic 🎄
        </p>
        <p className="text-white/30 text-xs mt-1">
          santa-qr.com
        </p>
      </div>
    </div>
  );
}
