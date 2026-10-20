import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/ui/ActionForm';
import { SelectField, TextAreaField } from '@/components/ui/Field';
import { mn } from '@/i18n/mn';
import { requireAdmin } from '@/lib/auth';
import { formatUbDateTime } from '@/lib/dates';
import { db } from '@/lib/db';
import { formatEstimate, formatPrice } from '@/lib/money';
import styles from '../../../admin.module.css';
import { updateOrderAction } from '../actions';
import { STATUS_LABELS } from '../status';

export default async function AdminOrderPage({ params }: { params: Promise<{ number: string }> }) {
  await requireAdmin('ORDERS');
  const number = Number((await params).number);
  if (!Number.isInteger(number) || number < 1) notFound();
  const order = await db.order.findUnique({
    where: { number },
    include: { items: { orderBy: { id: 'asc' } } },
  });
  if (!order) notFound();

  return (
    <div className="stack">
      <Link href="/admin/orders" className="muted">
        ← Захиалгууд
      </Link>
      <PageHeader title={`Захиалга #${order.number}`}>
        {formatUbDateTime(order.createdAt)} · {STATUS_LABELS[order.status]}
      </PageHeader>

      <section className="card">
        <h2>Хэрэглэгч</h2>
        <dl className={styles.details}>
          <dt>Утас (баталгаажсан)</dt>
          <dd>
            <a href={`tel:+976${order.phone}`}>{order.phone}</a>
          </dd>
          <dt>Хаяг</dt>
          <dd>Улаанбаатар, {order.address}</dd>
          {order.note && (
            <>
              <dt>Тайлбар</dt>
              <dd>{order.note}</dd>
            </>
          )}
          <dt>Холбогдох зөвшөөрөл</dt>
          <dd>{formatUbDateTime(order.consentAt)}</dd>
        </dl>
      </section>

      <section className="card">
        <h2>Үйлчилгээ (захиалгын үеийн үнэ)</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Үйлчилгээ</th>
                <th scope="col">Хэмжээ</th>
                <th scope="col">Нэгж үнэ</th>
                <th scope="col">Дүн</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    {item.quantity / 10} {mn.units[item.unit]}
                  </td>
                  <td>
                    {item.unitPrice === null ? mn.prices.onRequest : formatPrice(item.unitPrice)}
                  </td>
                  <td>{item.amount === null ? '—' : formatPrice(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Урьдчилсан дүн:{' '}
          <strong>
            {formatEstimate(
              order.items.map((item) => item.amount),
              mn.prices.onRequest,
            )}
          </strong>
        </p>
      </section>

      <section className="card">
        <h2>Төлөв ба дотоод тэмдэглэл</h2>
        <ActionForm action={updateOrderAction.bind(null, order.id)}>
          <SelectField
            label="Төлөв"
            name="status"
            options={STATUS_LABELS}
            defaultValue={order.status}
          />
          <TextAreaField
            label="Дотоод тэмдэглэл (хэрэглэгчид харагдахгүй)"
            name="internalNote"
            rows={4}
            maxLength={2000}
            defaultValue={order.internalNote ?? ''}
          />
          <div>
            <SubmitButton>Хадгалах</SubmitButton>
          </div>
        </ActionForm>
      </section>
    </div>
  );
}
