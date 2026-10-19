import type { Permission } from '@prisma/client';

export const PERMISSIONS = [
  'ORDERS',
  'CATALOG',
  'SETTINGS',
] as const satisfies readonly Permission[];

export const PERMISSION_LABELS: Record<Permission, string> = {
  ORDERS: 'Захиалга',
  CATALOG: 'Үйлчилгээ ба ажлын зураг',
  SETTINGS: 'Тохиргоо',
};

/** Админы хэсгийн цэс; `permission: 'OWNER'` нь зөвхөн бүрэн эрхтэй админд. */
export const ADMIN_NAV: { href: string; label: string; permission: Permission | 'OWNER' }[] = [
  { href: '/admin/admins', label: 'Админууд', permission: 'OWNER' },
];
