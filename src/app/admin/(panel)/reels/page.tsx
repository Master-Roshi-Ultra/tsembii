import { DeleteForm } from '@/components/admin/DeleteForm';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { CheckboxField, Field } from '@/components/ui/Field';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { createReelAction, deleteReelAction, updateReelAction } from './actions';

type EditableReel = { id: string; url: string; sortOrder: number; isVisible: boolean };

function ReelFields({ reel }: { reel?: EditableReel }) {
  const id = (name: string) => `${reel?.id ?? 'new'}-${name}`;
  return (
    <>
      <div className="row">
        <Field
          label="Reel линк"
          name="url"
          id={id('url')}
          type="url"
          placeholder="https://www.facebook.com/reel/…"
          defaultValue={reel?.url}
          required
          maxLength={500}
        />
        <Field
          label="Дараалал (бага нь эхэнд)"
          name="sortOrder"
          id={id('sortOrder')}
          type="number"
          min={0}
          max={999}
          defaultValue={reel?.sortOrder ?? 0}
        />
      </div>
      <CheckboxField
        name="isVisible"
        label="Сайтад харуулах"
        defaultChecked={reel?.isVisible ?? true}
      />
    </>
  );
}

export default async function AdminReelsPage() {
  await requireAdmin('CATALOG');
  const reels = await db.reel.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, url: true, sortOrder: true, isVisible: true },
  });

  return (
    <div className="stack">
      <PageHeader title="Reels">
        Facebook эсвэл Instagram дээрх reel-ийн линкийг хуулж оруулна. Нүүр хуудасны «Ажлын үр
        дүн»-гийн доор харагдана. Reel нийтэд нээлттэй (Public) байх ёстой.
      </PageHeader>

      {reels.map((reel) => (
        <details key={reel.id} className="card">
          <summary>
            <strong>{reel.url}</strong>
            {!reel.isVisible && <span className="badge">Нуусан</span>}
          </summary>
          <div className="stack">
            <a href={reel.url} target="_blank" rel="noopener noreferrer">
              Reel-ийг нээж харах ↗
            </a>
            <ActionForm action={updateReelAction.bind(null, reel.id)}>
              <ReelFields reel={reel} />
              <div>
                <SubmitButton>Хадгалах</SubmitButton>
              </div>
            </ActionForm>
            <DeleteForm action={deleteReelAction.bind(null, reel.id)} id={reel.id} />
          </div>
        </details>
      ))}

      <section className="card">
        <h2>Шинэ reel</h2>
        <ActionForm action={createReelAction} resetOnSuccess>
          <ReelFields />
          <div>
            <SubmitButton>Нэмэх</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
