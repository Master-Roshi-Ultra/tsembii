'use client';

import Link from 'next/link';
import { addToCart, useCartItems } from '@/lib/cart-store';
import styles from './cart.module.css';

/** Үйлчилгээний карт дээрх товч; сагсанд байвал сагс руу холбоно. */
export function AddToCartButton({
  serviceId,
  labels,
}: {
  serviceId: string;
  labels: { add: string; added: string };
}) {
  const inCart = useCartItems().some((item) => item.serviceId === serviceId);
  if (inCart) {
    return (
      <Link href="/order" className={`btn btn-secondary ${styles.addButton}`}>
        ✓ {labels.added}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={`btn ${styles.addButton}`}
      // Анхдагч хэмжээ: 1 нэгж (1 м², 1 ширхэг, 1 суудал)
      onClick={() => addToCart(serviceId, 10)}
    >
      + {labels.add}
    </button>
  );
}
