'use client';

import Image from 'next/image';

interface QRDisplayProps {
  qrCodeUrl: string;
  giftName: string;
}

export default function QRDisplay({ qrCodeUrl, giftName }: QRDisplayProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `santa-qr-${giftName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="gift-tag p-6 pt-8 text-center">
      {/* QR Code Image */}
      <div className="relative w-64 h-64 mx-auto mb-4 rounded-lg overflow-hidden">
        <Image
          src={qrCodeUrl}
          alt={`QR code for ${giftName}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Gift tag label */}
      <div className="text-gray-800 mb-4">
        <p className="font-festive text-xl text-christmas-red">To:</p>
        <p className="font-semibold">{giftName}</p>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="bg-christmas-green hover:bg-christmas-green/90 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <span>⬇️</span>
        Download QR Code
      </button>
    </div>
  );
}
