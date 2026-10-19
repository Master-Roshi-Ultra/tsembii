import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getHomeData } from '@/lib/public-data';

// Админы өөрчлөлт шууд харагдана; build үед DB шаардахгүй.
export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { settings, services } = await getHomeData();
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter phones={settings?.phones ?? []} services={services.map((s) => s.name)} />
    </>
  );
}
