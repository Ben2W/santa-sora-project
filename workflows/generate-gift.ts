import { FatalError, sleep } from 'workflow';
import { getGift, updateGift } from '@/lib/redis';
import { uploadVideo, uploadQRCode } from '@/lib/blob';
import { startSoraGeneration, getSoraStatus, downloadSoraVideo, generatePlaceholderVideo } from '@/lib/sora';
import { generateFestiveQRCode } from '@/lib/qrcode';
import { Gift } from '@/lib/types';

export async function generateGiftWorkflow(giftId: string) {
  'use workflow';

  const gift = await fetchGift(giftId);
  if (!gift) {
    return { error: 'Gift not found' };
  }

  try {
    // Step 1: Start Sora generation and store the ID
    const generationId = await startSoraStep(gift);

    // Step 2: Poll for completion using sleep (1 minute intervals, max 20 attempts)
    let videoBuffer: Buffer | null = null;
    const maxAttempts = 50;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await sleep('1 minute');

      const result = await checkSoraStatusStep(generationId, attempt, maxAttempts);

      if (result.status === 'completed') {
        videoBuffer = await downloadVideoStep(generationId);
        break;
      }

      if (result.status === 'failed') {
        console.log('Sora generation failed, using fallback');
        break;
      }

      // Still in progress, loop will continue after next sleep
    }

    // Step 3: If Sora failed or timed out, use fallback
    if (!videoBuffer) {
      videoBuffer = await getFallbackVideo();
    }

    // Step 4: Upload video
    const videoUrl = await uploadVideoStep(giftId, videoBuffer);

    // Step 5: Generate QR code
    const qrCodeUrl = await generateQR(giftId);

    // Step 6: Mark as ready
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

// Start Sora generation and store the ID in the database
async function startSoraStep(gift: Gift): Promise<string> {
  'use step';
  await updateGift(gift.id, { status: 'generating_video' });

  try {
    const generationId = await startSoraGeneration(
      gift.giftName,
      gift.recipientName,
      gift.jokes
    );
    // Store the generation ID so we can resume polling if needed
    await updateGift(gift.id, { soraGenerationId: generationId });
    return generationId;
  } catch (error) {
    console.error('Failed to start Sora generation:', error);
    throw new FatalError('Failed to start Sora generation');
  }
}

// Check Sora status - this step is called repeatedly via sleep loop
async function checkSoraStatusStep(
  generationId: string,
  attempt: number
  maxAttempts: number,
): Promise<{ status: 'queued' | 'in_progress' | 'completed' | 'failed' }> {
  'use step';
  console.log(`Checking Sora status (attempt ${attempt}/${maxAttempts})...`);
  const status = await getSoraStatus(generationId);
  return { status: status.status };
}

// Download completed video
async function downloadVideoStep(generationId: string): Promise<Buffer> {
  'use step';
  return downloadSoraVideo(generationId);
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
