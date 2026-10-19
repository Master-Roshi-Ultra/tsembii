import type { Permission } from '@prisma/client';
import { CheckboxField } from '@/components/ui/Field';
import { PERMISSION_LABELS, PERMISSIONS } from '@/lib/permissions';

/** Хандах эрхийн checkbox-ууд (нэмэх ба засах маягтад) */
export function PermissionFields({ selected = [] }: { selected?: Permission[] }) {
  return (
    <fieldset className="row">
      <legend className="muted">Хандах эрх</legend>
      {PERMISSIONS.map((permission) => (
        <CheckboxField
          key={permission}
          name="permissions"
          value={permission}
          label={PERMISSION_LABELS[permission]}
          defaultChecked={selected.includes(permission)}
        />
      ))}
    </fieldset>
  );
}
