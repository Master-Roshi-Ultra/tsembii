import { Contact } from '@/components/home/Contact';
import { Hero } from '@/components/home/Hero';
import { OrderSteps } from '@/components/home/OrderSteps';
import { Prices } from '@/components/home/Prices';
import { Services } from '@/components/home/Services';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { Works } from '@/components/home/Works';
import { getHomeData } from '@/lib/public-data';

// Админы өөрчлөлт шууд харагдана; build үед DB шаардахгүй.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { settings, services, works } = await getHomeData();
  return (
    <>
      <SiteHeader />
      <main>
        <Hero image={settings?.heroImage ?? null} />
        <Services services={services} />
        <Prices services={services} />
        <Works works={works} />
        <OrderSteps />
        <Contact settings={settings} />
      </main>
      <SiteFooter />
    </>
  );
}
