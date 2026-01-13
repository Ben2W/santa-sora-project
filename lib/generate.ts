import { getGift, updateGift } from './redis';
import { uploadVideo, uploadQRCode } from './blob';
import { generateSantaVideo, generatePlaceholderVideo } from './sora';
import { generateFestiveQRCode } from './qrcode';

export async function startGeneration(giftId: string): Promise<void> {
  try {
    const gift = await getGift(giftId);
    if (!gift) {
      console.error('Gift not found for generation:', giftId);
      return;
    }

    // Update status to generating video
    await updateGift(giftId, { status: 'generating_video' });

    let videoBuffer: Buffer;
    try {
      // Try to generate with Sora
      videoBuffer = await generateSantaVideo(
        gift.giftName,
        gift.recipientName,
        gift.jokes
      );
    } catch (error) {
      console.error('Sora generation failed, using placeholder:', error);
      // Fall back to placeholder video
      videoBuffer = await generatePlaceholderVideo();
    }

    // Upload video to Vercel Blob
    const videoUrl = await uploadVideo(videoBuffer, `${giftId}.mp4`);
    await updateGift(giftId, { videoUrl, status: 'generating_qr' });

    // Generate the playback URL for QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const playbackUrl = `${baseUrl}/play/${giftId}`;

    // Generate festive QR code
    let qrBuffer: Buffer;
    try {
      qrBuffer = await generateFestiveQRCode(playbackUrl);
    } catch (error) {
      console.error('Festive QR generation failed:', error);
      throw error;
    }

    // Upload QR code to Vercel Blob
    const qrCodeUrl = await uploadQRCode(qrBuffer, `${giftId}.png`);

    // Update gift as ready
    await updateGift(giftId, { qrCodeUrl, status: 'ready' });

    console.log('Generation complete for gift:', giftId);
  } catch (error) {
    console.error('Generation error for gift:', giftId, error);

    // Update gift status to error
    await updateGift(giftId, {
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
