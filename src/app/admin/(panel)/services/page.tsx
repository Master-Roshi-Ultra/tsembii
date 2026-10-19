import { DeleteForm } from '@/components/admin/DeleteForm';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { mn } from '@/i18n/mn';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/money';
import { createServiceAction, deleteServiceAction, updateServiceAction } from './actions';
import { ServiceFields } from './ServiceFields';

export default async function AdminServicesPage() {
  await requireAdmin('CATALOG');
  const services = await db.service.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      unit: true,
      price: true,
      sortOrder: true,
      isVisible: true,
      image: { select: { key: true } },
    },
  });

  return (
    <div className="stack">
      <PageHeader title="Үйлчилгээ">
        Нүүр хуудас болон сагсанд зөвхөн «Сайтад харуулах» үйлчилгээ гарна. Захиалгад ашиглагдсан
        үйлчилгээг устгах боломжгүй — нууна уу.
      </PageHeader>

      {services.map((service) => (
        <details key={service.id} className="card">
          <summary>
            <strong>{service.name}</strong>
            <span className="muted">
              {service.price === null
                ? mn.prices.onRequest
                : `${formatPrice(service.price)} / ${mn.units[service.unit]}`}
            </span>
            {!service.isVisible && <span className="badge">Нуусан</span>}
          </summary>
          <div className="stack">
            <ActionForm action={updateServiceAction.bind(null, service.id)}>
              <ServiceFields service={service} />
              <div>
                <SubmitButton>Хадгалах</SubmitButton>
              </div>
            </ActionForm>
            <DeleteForm action={deleteServiceAction.bind(null, service.id)} id={service.id} />
          </div>
        </details>
      ))}

      <section className="card">
        <h2>Шинэ үйлчилгээ</h2>
        <ActionForm action={createServiceAction} resetOnSuccess>
          <ServiceFields />
          <div>
            <SubmitButton>Нэмэх</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
