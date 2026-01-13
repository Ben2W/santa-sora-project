'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gift } from '@/lib/types';

interface GiftCardProps {
  gift: Gift;
}

function StatusBadge({ status }: { status: Gift['status'] }) {
  const statusConfig = {
    pending: { label: 'Queued', className: 'badge-pending' },
    generating_video: { label: 'Creating Video...', className: 'badge-generating' },
    generating_qr: { label: 'Making QR...', className: 'badge-generating' },
    ready: { label: 'Ready!', className: 'badge-ready' },
    error: { label: 'Error', className: 'badge-error' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`${config.className} px-3 py-1 rounded-full text-xs font-semibold`}
    >
      {config.label}
    </span>
  );
}

export default function GiftCard({ gift }: GiftCardProps) {
  const formattedDate = new Date(gift.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/gift/${gift.id}`} className="block group">
      <div className="card-frost overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        {/* QR Code Preview */}
        <div className="aspect-square relative bg-white/5 flex items-center justify-center">
          {gift.qrCodeUrl ? (
            <Image
              src={gift.qrCodeUrl}
              alt={`QR code for ${gift.giftName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center p-4">
              {gift.status === 'error' ? (
                <>
                  <div className="text-4xl mb-2">❌</div>
                  <p className="text-white/50 text-sm">Generation failed</p>
                </>
              ) : (
                <>
                  <div className="spinner w-12 h-12 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">Creating magic...</p>
                </>
              )}
            </div>
          )}

          {/* Ribbon for ready gifts */}
          {gift.status === 'ready' && (
            <div className="ribbon">
              <span>Ready!</span>
            </div>
          )}
        </div>

        {/* Gift Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white truncate flex-1">
              {gift.giftName}
            </h3>
            <StatusBadge status={gift.status} />
          </div>

          <p className="text-white/60 text-sm mb-2">
            For: {gift.recipientName}
          </p>

          <div className="flex items-center justify-between text-white/40 text-xs">
            <span>{formattedDate}</span>
            {gift.status === 'ready' && (
              <span className="text-christmas-green flex items-center gap-1">
                <span>📱</span> Tap to view
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
