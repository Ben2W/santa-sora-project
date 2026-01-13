import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGift, deleteGift } from '@/lib/redis';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const gift = await getGift(id);

  if (!gift) {
    return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
  }

  return NextResponse.json(gift);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteGift(id, userId);

  if (!deleted) {
    return NextResponse.json(
      { error: 'Gift not found or unauthorized' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
