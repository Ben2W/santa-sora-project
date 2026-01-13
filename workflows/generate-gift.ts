import { FatalError } from 'workflow';
import { getGift, updateGift } from '@/lib/redis';
import { uploadVideo, uploadQRCode } from '@/lib/blob';
import { generateSantaVideo, generatePlaceholderVideo } from '@/lib/sora';
import { generateFestiveQRCode } from '@/lib/qrcode';
import { Gift } from '@/lib/types';

export async function generateGiftWorkflow(giftId: string) {
  'use workflow';

  const gift = await fetchGift(giftId);
  if (!gift) {
    return { error: 'Gift not found' };
  }

  try {
    // Step 1: Try Sora (no retries - uses FatalError on failure)
    let videoBuffer = await trySoraGeneration(gift);

    // Step 2: If Sora failed, use fallback (this can retry)
    if (!videoBuffer) {
      videoBuffer = await getFallbackVideo();
    }

    // Step 3: Upload video (this can retry)
    const videoUrl = await uploadVideoStep(giftId, videoBuffer);

    // Step 4: Generate QR code (this can retry)
    const qrCodeUrl = await generateQR(giftId);

    // Step 5: Mark as ready
    await markReady(giftId, videoUrl, qrCodeUrl);

    return { success: true, giftId };
  } catch (error) {
    await markError(giftId, error);
    return { error: 'Generation failed' };
  }
}

async function fetchGift(giftId: string): Promise<Gift | null> {
  'use step';
  return getGift(giftId);
}

// This step tries Sora ONCE - if it fails, returns null (no retries via FatalError catch)
async function trySoraGeneration(gift: Gift): Promise<Buffer | null> {
  'use step';
  await updateGift(gift.id, { status: 'generating_video' });

  try {
    const videoBuffer = await generateSantaVideo(
      gift.giftName,
      gift.recipientName,
      gift.jokes
    );
    return videoBuffer;
  } catch (error) {
    // Log the error but don't retry - Sora costs $3 per attempt!
    console.error('Sora generation failed (not retrying - $3/attempt):', error);
    // Return null to signal we should use fallback
    // Throwing FatalError would stop the workflow entirely, so we just return null
    return null;
  }
}

// Fallback video step - this CAN retry since it's just fetching a static file
async function getFallbackVideo(): Promise<Buffer> {
  'use step';
  console.log('Using fallback placeholder video');
  return generatePlaceholderVideo();
}

// Upload step - this CAN retry since it's just infrastructure
async function uploadVideoStep(giftId: string, videoBuffer: Buffer): Promise<string> {
  'use step';
  return uploadVideo(videoBuffer, `${giftId}.mp4`);
}

async function generateQR(giftId: string): Promise<string> {
  'use step';
  await updateGift(giftId, { status: 'generating_qr' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const playbackUrl = `${baseUrl}/play/${giftId}`;
  const qrBuffer = await generateFestiveQRCode(playbackUrl);

  return uploadQRCode(qrBuffer, `${giftId}.png`);
}

async function markReady(
  giftId: string,
  videoUrl: string,
  qrCodeUrl: string
): Promise<void> {
  'use step';
  await updateGift(giftId, { videoUrl, qrCodeUrl, status: 'ready' });
  console.log('Generation complete for gift:', giftId);
}

async function markError(giftId: string, error: unknown): Promise<void> {
  'use step';
  console.error('Generation error for gift:', giftId, error);
  await updateGift(giftId, {
    status: 'error',
    errorMessage: error instanceof Error ? error.message : 'Unknown error',
  });
}
