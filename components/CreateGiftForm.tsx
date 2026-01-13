'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGiftForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    giftName: '',
    recipientName: '',
    jokes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create gift');
      }

      const gift = await response.json();
      router.push(`/gift/${gift.id}`);
    } catch (error) {
      console.error('Error creating gift:', error);
      alert('Failed to create gift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gift Name */}
      <div>
        <label
          htmlFor="giftName"
          className="block text-white font-semibold mb-2"
        >
          🎁 What&apos;s the Gift?
        </label>
        <input
          type="text"
          id="giftName"
          required
          placeholder="e.g., PlayStation 5, Cozy Sweater, LEGO Set..."
          className="input-festive w-full px-4 py-3"
          value={formData.giftName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, giftName: e.target.value }))
          }
        />
        <p className="text-white/50 text-sm mt-1">
          Santa will mention this when opening the gift
        </p>
      </div>

      {/* Recipient Name */}
      <div>
        <label
          htmlFor="recipientName"
          className="block text-white font-semibold mb-2"
        >
          👤 Who&apos;s it For?
        </label>
        <input
          type="text"
          id="recipientName"
          required
          placeholder="e.g., Emma, Grandma, The whole family..."
          className="input-festive w-full px-4 py-3"
          value={formData.recipientName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, recipientName: e.target.value }))
          }
        />
        <p className="text-white/50 text-sm mt-1">
          Santa will address them personally
        </p>
      </div>

      {/* Jokes */}
      <div>
        <label htmlFor="jokes" className="block text-white font-semibold mb-2">
          😄 Any Special Jokes or Messages? (Optional)
        </label>
        <textarea
          id="jokes"
          rows={4}
          placeholder="e.g., Tell them they've been extra good this year! Or mention how they always steal cookies..."
          className="input-festive w-full px-4 py-3 resize-none"
          value={formData.jokes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, jokes: e.target.value }))
          }
        />
        <p className="text-white/50 text-sm mt-1">
          Santa will work these into his message for extra laughs
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-festive w-full py-4 rounded-full text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="spinner w-6 h-6" />
            Creating Magic...
          </>
        ) : (
          <>
            <span>🎬</span>
            Create Santa&apos;s Video
          </>
        )}
      </button>

      <p className="text-center text-white/50 text-sm">
        Video generation takes about 1-2 minutes. You&apos;ll be redirected to
        watch the magic happen!
      </p>
    </form>
  );
}
