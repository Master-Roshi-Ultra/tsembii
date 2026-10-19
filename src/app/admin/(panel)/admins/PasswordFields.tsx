import { PasswordField } from '@/components/ui/PasswordField';
import { MIN_PASSWORD } from '@/lib/password';

/** Нууц үг ба давталт — алдаатай бичихээс сэргийлнэ (сервер дээр ч шалгана). */
export function PasswordFields({ id, label }: { id: string; label: string }) {
  return (
    <>
      <PasswordField
        label={`${label} (${MIN_PASSWORD}+ тэмдэгт)`}
        name="password"
        id={`${id}-password`}
        minLength={MIN_PASSWORD}
      />
      <PasswordField
        label="Нууц үг давтах"
        name="passwordConfirm"
        id={`${id}-password-confirm`}
        minLength={MIN_PASSWORD}
      />
    </>
  );
}
