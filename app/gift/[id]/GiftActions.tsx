'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GiftActionsProps {
  giftId: string;
  showRetry?: boolean;
}

export default function GiftActions({ giftId, showRetry }: GiftActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gift? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/gifts/${giftId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete gift');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete gift');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch('/api/generate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to retry generation');
      }
    } catch (error) {
      console.error('Retry error:', error);
      alert('Failed to retry generation');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-3">
      {showRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="block w-full bg-christmas-green hover:bg-christmas-green/90 text-white text-center py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
        >
          {isRetrying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner w-5 h-5" />
              Retrying...
            </span>
          ) : (
            '🔄 Retry Generation'
          )}
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="block w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 text-center py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
      >
        {isDeleting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner w-5 h-5" />
            Deleting...
          </span>
        ) : (
          '🗑️ Delete Gift'
        )}
      </button>
    </div>
  );
}
