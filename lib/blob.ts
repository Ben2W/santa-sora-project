import { put, del } from '@vercel/blob';

export async function uploadVideo(videoBuffer: Buffer, filename: string): Promise<string> {
  const blob = await put(`videos/${filename}`, videoBuffer, {
    access: 'public',
    contentType: 'video/mp4',
  });
  return blob.url;
}

export async function uploadQRCode(imageBuffer: Buffer, filename: string): Promise<string> {
  const blob = await put(`qrcodes/${filename}`, imageBuffer, {
    access: 'public',
    contentType: 'image/png',
  });
  return blob.url;
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url);
}
