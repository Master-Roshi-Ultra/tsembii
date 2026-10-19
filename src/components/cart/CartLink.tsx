'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartItems } from '@/lib/cart-store';
import styles from './cart.module.css';

const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2M9 20h.01M17 20h.01"
    />
  </svg>
);

/** Толгой хэсгийн сагсны товч, тоотой */
export function CartLink({ label }: { label: string }) {
  const items = useCartItems();
  return (
    <Link href="/order" className={styles.cartLink} aria-label={`${label} (${items.length})`}>
      <CartIcon />
      {items.length > 0 && <span className={styles.count}>{items.length}</span>}
    </Link>
  );
}

/** Утасны доод тууз: сагсанд зүйл байхад, захиалгын хуудсаас бусад газар харагдана. */
export function CartBar({ label, itemsLabel }: { label: string; itemsLabel: string }) {
  const items = useCartItems();
  const pathname = usePathname();
  if (!items.length || pathname === '/order') return null;
  return (
    <>
      {/* Хуудасны доод хэсгийг тууз дарахгүйн тулд зай */}
      <div className={styles.cartBarSpacer} />
      <Link href="/order" className={styles.cartBar}>
        <CartIcon />
        <span>
          {label} · {items.length} {itemsLabel}
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}
