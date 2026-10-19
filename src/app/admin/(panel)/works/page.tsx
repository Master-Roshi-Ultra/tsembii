import { DeleteForm } from '@/components/admin/DeleteForm';
import { ImageInput } from '@/components/admin/ImageInput';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { CheckboxField, Field } from '@/components/ui/Field';
import { requireAdmin } from '@/lib/auth';
import { formatDate, toDateInput, ubToday } from '@/lib/dates';
import { db } from '@/lib/db';
import { createWorkAction, deleteWorkAction, updateWorkAction } from './actions';

type EditableWork = {
  id: string;
  title: string;
  doneOn: Date;
  location: string;
  sortOrder: number;
  isVisible: boolean;
  beforeImage: { key: string };
  afterImage: { key: string };
};

/** Ажил нэмэх ба засах маягтын талбарууд; шинэ ажилд хоёр зураг заавал. */
function WorkFields({ work }: { work?: EditableWork }) {
  const id = (name: string) => `${work?.id ?? 'new'}-${name}`;
  return (
    <>
      <div className="row">
        <Field
          label="Ажлын нэр"
          name="title"
          id={id('title')}
          defaultValue={work?.title}
          required
          maxLength={120}
        />
      </div>
      <div className="row">
        <Field
          label="Ажил хийсэн огноо"
          name="doneOn"
          id={id('doneOn')}
          type="date"
          max={ubToday()}
          defaultValue={work ? toDateInput(work.doneOn) : ubToday()}
          required
        />
        <Field
          label="Байршил"
          name="location"
          id={id('location')}
          placeholder="Баянзүрх дүүрэг"
          defaultValue={work?.location}
          required
          maxLength={80}
        />
        <Field
          label="Дараалал (бага нь эхэнд)"
          name="sortOrder"
          id={id('sortOrder')}
          type="number"
          min={0}
          max={999}
          defaultValue={work?.sortOrder ?? 0}
        />
      </div>
      <div className="row">
        <ImageInput
          name="before"
          id={id('before')}
          label="Өмнөх зураг"
          current={work?.beforeImage}
          required
        />
        <ImageInput
          name="after"
          id={id('after')}
          label="Дараах зураг"
          current={work?.afterImage}
          required
        />
      </div>
      <CheckboxField
        name="isVisible"
        label="Сайтад харуулах"
        defaultChecked={work?.isVisible ?? true}
      />
    </>
  );
}

export default async function AdminWorksPage() {
  await requireAdmin('CATALOG');
  const works = await db.work.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      title: true,
      doneOn: true,
      location: true,
      sortOrder: true,
      isVisible: true,
      beforeImage: { select: { key: true } },
      afterImage: { select: { key: true } },
    },
  });

  return (
    <div className="stack">
      <PageHeader title="Ажлын үр дүн">
        Нэг эд зүйлийн цэвэрлэгээний өмнөх ба дараах бодит зургийг хосоор нь оруулна.
      </PageHeader>

      {works.map((work) => (
        <details key={work.id} className="card">
          <summary>
            <strong>{work.title}</strong>
            <span className="muted">
              {formatDate(work.doneOn)} · {work.location || 'байршилгүй'}
            </span>
            {!work.isVisible && <span className="badge">Нуусан</span>}
          </summary>
          <div className="stack">
            <ActionForm action={updateWorkAction.bind(null, work.id)}>
              <WorkFields work={work} />
              <div>
                <SubmitButton>Хадгалах</SubmitButton>
              </div>
            </ActionForm>
            <DeleteForm action={deleteWorkAction.bind(null, work.id)} id={work.id} />
          </div>
        </details>
      ))}

      <section className="card">
        <h2>Шинэ ажил</h2>
        <ActionForm action={createWorkAction} resetOnSuccess>
          <WorkFields />
          <div>
            <SubmitButton>Нэмэх</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
