import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { Field } from '@/components/ui/Field';
import { Logo } from '@/components/ui/Logo';
import { PasswordField } from '@/components/ui/PasswordField';
import { getCurrentAdmin } from '@/lib/auth';
import styles from '../admin.module.css';
import { loginAction } from './actions';

export const metadata: Metadata = { title: 'Админ — нэвтрэх', robots: { index: false } };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect('/admin');
  return (
    <main className={styles.login}>
      <div className={`card ${styles.loginCard}`}>
        <div className={styles.loginLogo}>
          <Logo showName />
        </div>
        <h1>Админ нэвтрэх</h1>
        <ActionForm action={loginAction}>
          <Field label="Имэйл" name="email" type="email" autoComplete="username" required />
          <PasswordField label="Нууц үг" name="password" autoComplete="current-password" />
          <SubmitButton>Нэвтрэх</SubmitButton>
        </ActionForm>
      </div>
    </main>
  );
}
