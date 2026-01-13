'use client';

import { useState, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  recipientName: string;
  giftName: string;
}

export default function VideoPlayer({
  videoUrl,
  recipientName,
  giftName,
}: VideoPlayerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Festive frame */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-christmas-gold rounded-tl-2xl z-10" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-christmas-gold rounded-tr-2xl z-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-christmas-gold rounded-bl-2xl z-10" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-christmas-gold rounded-br-2xl z-10" />

        {/* Video container - 16:9 aspect ratio to match video */}
        <div className="aspect-video bg-black relative">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onEnded={() => setHasStarted(false)}
            playsInline
            controls={hasStarted}
          />

          {/* Play overlay */}
          {!hasStarted && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 transition-opacity hover:bg-black/50"
            >
              <div className="text-6xl mb-4 animate-bounce">🎅</div>
              <div className="w-20 h-20 rounded-full bg-christmas-red flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white text-3xl ml-1">▶</span>
              </div>
              <p className="text-white font-festive text-2xl">
                Tap to Play
              </p>
              <p className="text-white/70 text-sm mt-2">
                Santa has a message for {recipientName}!
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Gift info below video */}
      <div className="mt-4 text-center">
        <p className="text-christmas-gold font-festive text-xl">
          A Special Message About Your {giftName}
        </p>
      </div>
    </div>
  );
}
