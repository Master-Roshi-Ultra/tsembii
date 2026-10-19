import { Contact } from '@/components/home/Contact';
import { Hero } from '@/components/home/Hero';
import { OrderSteps } from '@/components/home/OrderSteps';
import { Prices } from '@/components/home/Prices';
import { Reels } from '@/components/home/Reels';
import { Services } from '@/components/home/Services';
import { Works } from '@/components/home/Works';
import { getHomeData } from '@/lib/public-data';

export default async function HomePage() {
  const { settings, services, works, reels } = await getHomeData();
  return (
    <>
      <Hero image={settings?.heroImage ?? null} />
      <Services services={services} />
      <Prices services={services} />
      <Works works={works} />
      <Reels reels={reels} />
      <OrderSteps />
      <Contact settings={settings} />
    </>
  );
}
