import { ImageInput } from '@/components/admin/ImageInput';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { Field, TextAreaField } from '@/components/ui/Field';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateSettingsAction } from './actions';

export default async function AdminSettingsPage() {
  await requireAdmin('SETTINGS');
  const settings = await db.setting.findUnique({
    where: { id: 1 },
    select: { phones: true, hours: true, area: true, heroImage: { select: { key: true } } },
  });

  return (
    <div className="stack">
      <PageHeader title="Тохиргоо">
        Нүүр хуудасны холбоо барих мэдээлэл ба гол зураг. Хадгалмагц сайтад шууд харагдана.
      </PageHeader>
      <section className="card">
        <ActionForm action={updateSettingsAction}>
          <TextAreaField
            label="Утасны дугаар (мөр бүрт нэг)"
            name="phones"
            rows={3}
            defaultValue={settings?.phones.join('\n')}
            required
          />
          <div className="row">
            <Field
              label="Ажлын цаг"
              name="hours"
              defaultValue={settings?.hours}
              placeholder="Дуудлагаар"
              required
              maxLength={80}
            />
            <Field
              label="Үйлчлэх бүс"
              name="area"
              defaultValue={settings?.area}
              placeholder="Улаанбаатар"
              required
              maxLength={80}
            />
          </div>
          <ImageInput
            id="hero-image"
            label="Нүүрний гол зураг (интерьерийн жишээ зураг болно)"
            current={settings?.heroImage}
            removable
          />
          <div>
            <SubmitButton>Хадгалах</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
