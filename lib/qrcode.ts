import QRCode from 'qrcode';

export async function generateFestiveQRCode(url: string): Promise<Buffer> {
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 512,
    margin: 2,
    color: {
      dark: '#c41e3a', // Christmas red
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });

  return qrBuffer;
}
