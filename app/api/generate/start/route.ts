import { NextRequest, NextResponse } from 'next/server';
import { startGeneration } from '@/lib/generate';
import { getGift } from '@/lib/redis';

export const maxDuration = 300; // 5 minutes timeout for video generation

export async function POST(request: NextRequest) {
  try {
    const { giftId } = await request.json();

    if (!giftId) {
      return NextResponse.json({ error: 'Gift ID required' }, { status: 400 });
    }

    const gift = await getGift(giftId);
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    // Start generation (don't await - let it run in background)
    startGeneration(giftId).catch((err) =>
      console.error('Generation failed:', err)
    );

    return NextResponse.json({ success: true, message: 'Generation started' });
  } catch (error) {
    console.error('Generation start error:', error);
    return NextResponse.json(
      { error: 'Failed to start generation' },
      { status: 500 }
    );
  }
}
