import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { CheckboxField, Field } from '@/components/ui/Field';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { PERMISSION_LABELS } from '@/lib/permissions';
import { createAdminAction, resetPasswordAction, updateAdminAction } from './actions';
import { PermissionFields } from './PermissionFields';

export default async function AdminsPage() {
  await requireAdmin('OWNER');
  const admins = await db.admin.findMany({
    orderBy: [{ isOwner: 'desc' }, { createdAt: 'asc' }],
    select: { id: true, name: true, email: true, isOwner: true, isActive: true, permissions: true },
  });

  return (
    <div className="stack">
      <PageHeader title="Админууд">
        Энгийн админ зөвхөн олгосон хэсэгтээ хандана. Идэвхгүй болгох эсвэл нууц үг солиход тухайн
        админ системээс гарна.
      </PageHeader>

      {admins.map((admin) =>
        admin.isOwner ? (
          <section key={admin.id} className="card stack">
            <p>
              <strong>{admin.name}</strong> <span className="muted">{admin.email}</span>{' '}
              <span className="badge">Бүрэн эрх</span>
            </p>
          </section>
        ) : (
          <details key={admin.id} className="card">
            <summary>
              <strong>{admin.name}</strong> <span className="muted">{admin.email}</span>{' '}
              {admin.isActive ? (
                admin.permissions.map((p) => (
                  <span key={p} className="badge">
                    {PERMISSION_LABELS[p]}
                  </span>
                ))
              ) : (
                <span className="badge">Идэвхгүй</span>
              )}
            </summary>
            <div className="stack">
              <ActionForm action={updateAdminAction.bind(null, admin.id)}>
                <Field
                  label="Нэр"
                  name="name"
                  id={`${admin.id}-name`}
                  defaultValue={admin.name}
                  required
                />
                <PermissionFields selected={admin.permissions} />
                <CheckboxField name="isActive" label="Идэвхтэй" defaultChecked={admin.isActive} />
                <div>
                  <SubmitButton>Хадгалах</SubmitButton>
                </div>
              </ActionForm>
              <ActionForm action={resetPasswordAction.bind(null, admin.id)} className="row">
                <Field
                  label="Шинэ нууц үг"
                  name="password"
                  id={`${admin.id}-password`}
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  required
                />
                <SubmitButton className="btn btn-secondary">Нууц үг солих</SubmitButton>
              </ActionForm>
            </div>
          </details>
        ),
      )}

      <section className="card">
        <h2>Шинэ админ</h2>
        <ActionForm action={createAdminAction} resetOnSuccess>
          <div className="row">
            <Field label="Нэр" name="name" id="new-name" required maxLength={80} />
            <Field label="Имэйл" name="email" id="new-email" type="email" required />
            <Field
              label="Нууц үг (10+ тэмдэгт)"
              name="password"
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
            />
          </div>
          <PermissionFields />
          <div>
            <SubmitButton>Нэмэх</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
