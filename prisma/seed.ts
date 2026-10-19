import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

/** Брифийн анхны ангиллууд; үнийг админ оруулна (хоосон = «Үнэ тохирно»). */
const INITIAL_SERVICES = [
  { name: 'Хивс цэвэрлэгээ', unit: 'SQM' },
  { name: 'Буйдан цэвэрлэгээ', unit: 'SEAT' },
  { name: 'Матрас цэвэрлэгээ', unit: 'PIECE' },
  { name: 'Сандал цэвэрлэгээ', unit: 'PIECE' },
] as const;

async function main() {
  const { SEED_OWNER_EMAIL: email, SEED_OWNER_PASSWORD: password } = process.env;
  if (!email || !password)
    throw new Error('SEED_OWNER_EMAIL, SEED_OWNER_PASSWORD-ийг .env-д бөглөнө үү');

  // Давтан ажиллуулахад одоо байгаа өгөгдлийг өөрчлөхгүй.
  await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      name: process.env.SEED_OWNER_NAME || 'Админ',
      passwordHash: await hashPassword(password),
      isOwner: true,
    },
  });

  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { phones: ['9422-7111', '9686-3070'], hours: 'Дуудлагаар', area: 'Улаанбаатар' },
  });

  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: INITIAL_SERVICES.map((service, i) => ({ ...service, sortOrder: i })),
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
