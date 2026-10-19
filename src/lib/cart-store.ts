'use client';

import { useSyncExternalStore } from 'react';
import type { CartItem } from './cart';

/**
 * Сагсыг browser-т хадгална: зөвхөн үйлчилгээний id ба хэмжээ.
 * Утас, хаяг, баталгаажуулалтыг энд хэзээ ч хадгалахгүй.
 */
const KEY = 'tsembii-cart';
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cached: CartItem[] = EMPTY;

function parse(raw: string | null): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value)) return EMPTY;
    return value.filter(
      (item): item is CartItem =>
        typeof item?.serviceId === 'string' && Number.isInteger(item.quantity) && item.quantity > 0,
    );
  } catch {
    return EMPTY;
  }
}

function read(): CartItem[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cached; // хувийн цонх гэх мэт: санах ойд л хадгална
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parse(raw);
  }
  return cached;
}

function write(items: CartItem[]) {
  cachedRaw = JSON.stringify(items);
  cached = items;
  try {
    localStorage.setItem(KEY, cachedRaw);
  } catch {
    // хадгалах боломжгүй бол санах ойд үлдэнэ
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => event.key === KEY && listener();
  window.addEventListener('storage', onStorage); // өөр табад өөрчилсөн
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Сагсны мөрүүд (render бүрт ижил reference — өөрчлөгдөхөд л шинэ) */
export const useCartItems = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export function addToCart(serviceId: string, quantity: number) {
  if (!read().some((i) => i.serviceId === serviceId)) write([...read(), { serviceId, quantity }]);
}

export const setCartQuantity = (serviceId: string, quantity: number) =>
  write(read().map((i) => (i.serviceId === serviceId ? { ...i, quantity } : i)));

export const removeFromCart = (...serviceIds: string[]) =>
  write(read().filter((i) => !serviceIds.includes(i.serviceId)));

export const clearCart = () => write(EMPTY);
