import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { createGift, getUserGifts } from '@/lib/redis';
import { startGeneration } from '@/lib/generate';
import { Gift } from '@/lib/types';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const gifts = await getUserGifts(userId);
  return NextResponse.json(gifts);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { giftName, recipientName, jokes } = body;

    if (!giftName || !recipientName) {
      return NextResponse.json(
        { error: 'Gift name and recipient name are required' },
        { status: 400 }
      );
    }

    const gift: Gift = {
      id: nanoid(10),
      userId,
      giftName,
      recipientName,
      jokes: jokes || '',
      videoUrl: null,
      qrCodeUrl: null,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await createGift(gift);

    // Trigger generation in the background (don't await)
    startGeneration(gift.id).catch((err) =>
      console.error('Failed to start generation:', err)
    );

    return NextResponse.json(gift);
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    );
  }
}
