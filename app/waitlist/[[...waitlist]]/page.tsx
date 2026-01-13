import { Waitlist } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function WaitlistPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <Waitlist
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white/10 backdrop-blur-lg border border-white/20',
            headerTitle: 'text-christmas-gold font-festive',
            headerSubtitle: 'text-white/70',
            formButtonPrimary: 'bg-christmas-red hover:bg-christmas-red/90',
            footerActionLink: 'text-christmas-gold hover:text-christmas-gold/80',
          },
        }}
      />
    </div>
  );
}
