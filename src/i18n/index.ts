import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { en } from './en';
import { mn } from './mn';

export const LOCALES = ['mn', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = 'lang';
const DICTIONARIES = { mn, en };

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

/** Cookie-д сонгосон хэл; байхгүй бол монгол */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : 'mn';
});

export const getDictionary = cache(async () => DICTIONARIES[await getLocale()]);
