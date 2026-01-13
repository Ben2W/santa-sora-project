import { Redis } from '@upstash/redis';
import { Gift } from './types';

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

export async function createGift(gift: Gift): Promise<void> {
  const redis = getRedis();
  await redis.set(`gift:${gift.id}`, JSON.stringify(gift));
  await redis.lpush(`user:${gift.userId}:gifts`, gift.id);
}

export async function getGift(id: string): Promise<Gift | null> {
  const redis = getRedis();
  const data = await redis.get(`gift:${id}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data as Gift;
}

export async function updateGift(id: string, updates: Partial<Gift>): Promise<Gift | null> {
  const gift = await getGift(id);
  if (!gift) return null;

  const updatedGift = { ...gift, ...updates, updatedAt: Date.now() };
  const redis = getRedis();
  await redis.set(`gift:${id}`, JSON.stringify(updatedGift));
  return updatedGift;
}

export async function deleteGift(id: string, userId: string): Promise<boolean> {
  const gift = await getGift(id);
  if (!gift || gift.userId !== userId) return false;

  const redis = getRedis();
  await redis.del(`gift:${id}`);
  await redis.lrem(`user:${userId}:gifts`, 1, id);
  return true;
}

export async function getUserGifts(userId: string): Promise<Gift[]> {
  const redis = getRedis();
  const giftIds = await redis.lrange(`user:${userId}:gifts`, 0, -1);
  if (!giftIds || giftIds.length === 0) return [];

  const gifts = await Promise.all(
    giftIds.map(id => getGift(id as string))
  );

  return gifts.filter((g): g is Gift => g !== null);
}
