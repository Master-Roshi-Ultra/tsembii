import type { Permission } from '@prisma/client';

export const PERMISSIONS = [
  'ORDERS',
  'CATALOG',
  'SETTINGS',
] as const satisfies readonly Permission[];

export const PERMISSION_LABELS: Record<Permission, string> = {
  ORDERS: 'Захиалга',
  CATALOG: 'Үйлчилгээ, ажлын зураг, reels',
  SETTINGS: 'Тохиргоо',
};

/** Админы хэсгийн цэс; `permission: 'OWNER'` нь зөвхөн бүрэн эрхтэй админд. */
export const ADMIN_NAV: { href: string; label: string; permission: Permission | 'OWNER' }[] = [
  { href: '/admin/orders', label: 'Захиалга', permission: 'ORDERS' },
  { href: '/admin/services', label: 'Үйлчилгээ', permission: 'CATALOG' },
  { href: '/admin/works', label: 'Ажлын үр дүн', permission: 'CATALOG' },
  { href: '/admin/settings', label: 'Тохиргоо', permission: 'SETTINGS' },
  { href: '/admin/admins', label: 'Админууд', permission: 'OWNER' },
  { href: '/admin/reels', label: 'Reels', permission: 'CATALOG' },
];
