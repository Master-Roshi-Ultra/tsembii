import { PrismaClient } from '@prisma/client';
import { hashPassword, MIN_PASSWORD } from '../src/lib/password';

const prisma = new PrismaClient();

/** Брифийн анхны ангиллууд; үнийг админ оруулна (хоосон = «Үнэ тохирно»). */
const INITIAL_SERVICES = [
  { name: 'Хивс цэвэрлэгээ', unit: 'SQM' },
  { name: 'Буйдан цэвэрлэгээ', unit: 'SEAT' },
  { name: 'Матрас цэвэрлэгээ', unit: 'PIECE' },
  { name: 'Сандал цэвэрлэгээ', unit: 'PIECE' },
] as const;

/**
 * Сервер эхлэх бүрт ажиллана (`npm run start`), тиймээс зөвхөн анх удаа үүсгэнэ:
 * - Тохиргоо байхгүй бол (анхны суулгалт) холбоо барих мэдээлэл ба эхний үйлчилгээ.
 *   Дараа нь админ үйлчилгээгээ устгасан ч дахин үүсгэхгүй.
 * - Бүрэн эрхтэй админ байхгүй, SEED_OWNER_* өгөгдсөн бол түүнийг. Нэг л бүрэн эрхтэй админ байна.
 */
async function main() {
  if (!(await prisma.setting.findUnique({ where: { id: 1 } }))) {
    await prisma.$transaction([
      prisma.setting.create({
        data: { phones: ['9422-7111', '9686-3070'], hours: 'Дуудлагаар', area: 'Улаанбаатар' },
      }),
      prisma.service.createMany({
        data: INITIAL_SERVICES.map((service, i) => ({ ...service, sortOrder: i })),
      }),
    ]);
    console.log('seed: анхны тохиргоо ба үйлчилгээ үүслээ');
  }

  if (await prisma.admin.findFirst({ where: { isOwner: true } })) return;
  const { SEED_OWNER_EMAIL: email, SEED_OWNER_PASSWORD: password } = process.env;
  if (!email || !password || password.length < MIN_PASSWORD) {
    console.warn(
      `seed: бүрэн эрхтэй админ алга — SEED_OWNER_EMAIL, SEED_OWNER_PASSWORD (${MIN_PASSWORD}+ тэмдэгт) тохируулна уу`,
    );
    return;
  }
  await prisma.admin.create({
    data: {
      email: email.trim().toLowerCase(),
      name: process.env.SEED_OWNER_NAME || 'Админ',
      passwordHash: await hashPassword(password),
      isOwner: true,
    },
  });
  console.log(`seed: бүрэн эрхтэй админ үүслээ (${email})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
