'use client';

import {
  createContext,
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import type { FormState } from '@/lib/form';

type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

const PendingContext = createContext(false);

/**
 * Server action-тай маягт: үр дүнгийн мессежийг доор нь харуулна.
 * `<form action>` нь React 19-д алдаа гарсан ч маягтыг хоослодог тул JS-тэй үед onSubmit-ээр илгээж,
 * зөвхөн амжилттай үед (`resetOnSuccess`) хоослоно. Сонгосон файлыг амжилтын дараа үргэлж цэвэрлэнэ.
 */
export function ActionForm({
  action,
  children,
  className = 'stack',
  resetOnSuccess = false,
}: {
  action: FormAction;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, dispatch, pending] = useActionState(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!state.ok || !form) return;
    if (resetOnSuccess) form.reset();
    form.querySelectorAll<HTMLInputElement>('input[type=file]').forEach((input) => {
      input.value = '';
    });
  }, [state, resetOnSuccess]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  }

  return (
    <form ref={formRef} action={dispatch} onSubmit={onSubmit} className={className}>
      <PendingContext value={pending}>{children}</PendingContext>
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
  const pending = useContext(PendingContext);
  return (
    <button type="submit" className={className} disabled={pending} name={name} value={value}>
      {pending ? 'Түр хүлээнэ үү…' : children}
    </button>
  );
}
