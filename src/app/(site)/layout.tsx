import type { ReactNode } from 'react';
import { CartBar } from '@/components/cart/CartLink';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getDictionary } from '@/i18n';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getHomeData } from '@/lib/public-data';

// Админы өөрчлөлт шууд харагдана; build үед DB шаардахгүй.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [{ settings, services }, t] = await Promise.all([getHomeData(), getDictionary()]);
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter phones={settings?.phones ?? []} services={services.map((s) => s.name)} />
      <CartBar label={t.cart.open} itemsLabel={t.cart.items} />
    </>
  );
}
