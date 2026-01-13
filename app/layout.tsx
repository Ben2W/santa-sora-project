import type { Metadata } from 'next';
import { Mountains_of_Christmas, Quicksand } from 'next/font/google';
import Providers from '@/components/Providers';
import Snowfall from '@/components/Snowfall';
import Header from '@/components/Header';
import './globals.css';

const mountainsOfChristmas = Mountains_of_Christmas({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-festive',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Santa's Video Magic - Personalized Santa Videos for Your Gifts",
  description:
    'Create magical personalized Santa videos with AI-generated festive QR codes. Print, attach to gifts, and let recipients scan for a special holiday surprise!',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mountainsOfChristmas.variable} ${quicksand.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <Snowfall />
          <Header />
          <main className="relative z-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
