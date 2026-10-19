import 'server-only';
import { cache } from 'react';
import { db } from './db';

const imageSelect = { select: { key: true, width: true, height: true } } as const;
const visibleOrder = [{ sortOrder: 'asc' }, { createdAt: 'asc' }] as const;

/** Нүүр хуудасны бүх өгөгдөл: зөвхөн нийтэд харагдах үйлчилгээ ба ажил */
export const getHomeData = cache(async () => {
  const [settings, services, works] = await Promise.all([
    db.setting.findUnique({
      where: { id: 1 },
      select: { phones: true, hours: true, area: true, heroImage: imageSelect },
    }),
    db.service.findMany({
      where: { isVisible: true },
      orderBy: [...visibleOrder],
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        price: true,
        image: imageSelect,
      },
    }),
    db.work.findMany({
      where: { isVisible: true },
      orderBy: [...visibleOrder],
      select: {
        id: true,
        title: true,
        doneOn: true,
        location: true,
        beforeImage: imageSelect,
        afterImage: imageSelect,
      },
    }),
  ]);
  return { settings, services, works };
});

type HomeData = Awaited<ReturnType<typeof getHomeData>>;
export type PublicSettings = NonNullable<HomeData['settings']>;
export type PublicService = HomeData['services'][number];
export type PublicWork = HomeData['works'][number];
export type PublicImage = PublicService['image'];

/** «9422-7111» → «tel:+97694227111» */
export const telHref = (phone: string) => `tel:+976${phone.replace(/\D/g, '').slice(-8)}`;
