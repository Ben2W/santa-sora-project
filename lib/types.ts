export interface Gift {
  id: string;
  userId: string;
  giftName: string;
  recipientName: string;
  jokes: string;
  videoUrl: string | null;
  qrCodeUrl: string | null;
  status: 'pending' | 'generating_video' | 'generating_qr' | 'ready' | 'error';
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateGiftInput {
  giftName: string;
  recipientName: string;
  jokes: string;
}
