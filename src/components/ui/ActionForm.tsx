'use client';

import { type ReactNode, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { FormState } from '@/lib/form';

type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

/** Server action-тай маягт: үр дүнгийн мессежийг доор нь харуулна. */
export function ActionForm({
  action,
  children,
  className = 'stack',
}: {
  action: FormAction;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className={className}>
      {children}
      {state.message && (
        <p role="status" className={state.ok ? 'notice' : 'notice notice-error'}>
          {state.message}
        </p>
      )}
    </form>
  );
}

/** Илгээж байх үед идэвхгүй болж, давхар дарахаас хамгаална. */
export function SubmitButton({
  children,
  className = 'btn',
  name,
  value,
}: {
  children: ReactNode;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} name={name} value={value}>
      {pending ? 'Түр хүлээнэ үү…' : children}
    </button>
  );
}
