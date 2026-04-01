import { Platform } from 'react-native';
import type { CategorySlug } from '../../api/potterdb';

export const sansBtn = Platform.select({
  ios: undefined,
  default: 'sans-serif',
});

export const ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
] as const;

export function stable01(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (h % 1000) / 1000;
}

export function romanFromProgress(p: number): string {
  const i = Math.min(11, Math.max(0, Math.floor(p * 12)));
  return ROMAN[i];
}

function nonEmptyUrl(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const u = v.trim();
  return u.length ? u : null;
}

export function coverImage(category: CategorySlug, a: Record<string, unknown>): string | null {
  if (category === 'books') return nonEmptyUrl(a.cover);
  if (category === 'movies') return nonEmptyUrl(a.poster);
  return nonEmptyUrl(a.image);
}
