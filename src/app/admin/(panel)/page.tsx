import { redirect } from 'next/navigation';
import { can, requireAdmin } from '@/lib/auth';
import { ADMIN_NAV } from '@/lib/permissions';

/** Админы эхлэл: эрх бүхий эхний хэсэг рүү шилжинэ. */
export default async function AdminHome() {
  const admin = await requireAdmin();
  const first = ADMIN_NAV.find((item) =>
    item.permission === 'OWNER' ? admin.isOwner : can(admin, item.permission),
  );
  if (first) redirect(first.href);
  return (
    <p className="notice notice-error">
      Танд хандах эрх олгогдоогүй байна. Бүрэн эрхтэй админд хандана уу.
    </p>
  );
}
