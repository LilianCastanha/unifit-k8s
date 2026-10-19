import { environment } from '@env/environment';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export async function sleep(ms: number = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createENV(suffix?: string) {
  return `${environment.API_URL}${suffix || ''}`;
}
