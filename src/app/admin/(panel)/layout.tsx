import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { can, requireAdmin } from '@/lib/auth';
import { ADMIN_NAV } from '@/lib/permissions';
import styles from '../admin.module.css';
import { logoutAction } from './actions';

export const metadata: Metadata = { title: 'Цэмбий — админ', robots: { index: false } };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const nav = ADMIN_NAV.filter((item) =>
    item.permission === 'OWNER' ? admin.isOwner : can(admin, item.permission),
  );

  return (
    <div className={styles.panel}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.sidebarLogo}>
          <Logo showName />
        </Link>
        <nav aria-label="Админы цэс" className={styles.sidebarNav}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>
            {admin.name}
            {admin.isOwner && <span className="badge">Бүрэн эрх</span>}
          </p>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-outline-light">
              Гарах
            </button>
          </form>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
