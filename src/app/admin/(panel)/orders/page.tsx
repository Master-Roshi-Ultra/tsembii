import Link from 'next/link';
import { PageHeader } from '@/components/admin/PageHeader';
import { requireAdmin } from '@/lib/auth';
import { formatUbDateTime } from '@/lib/dates';
import { db } from '@/lib/db';
import { formatEstimate } from '@/lib/money';
import { mn } from '@/i18n/mn';
import styles from '../../admin.module.css';
import { isOrderStatus, ORDER_STATUSES, orderSearchWhere, STATUS_LABELS } from './status';

const PAGE_SIZE = 20;

type Search = { q?: string; status?: string; page?: string };

/** Шүүлтүүрийг хадгалж хуудасны холбоос үүсгэнэ. */
const pageHref = ({ q, status }: Search, page: number) =>
  `/admin/orders?${new URLSearchParams({
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    page: String(page),
  })}`;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin('ORDERS');
  const search = await searchParams;
  const q = (search.q ?? '').slice(0, 40);
  const status = isOrderStatus(search.status) ? search.status : undefined;
  const page = Math.max(1, Math.floor(Number(search.page)) || 1);

  const where = { ...orderSearchWhere(q), ...(status ? { status } : {}) };
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        number: true,
        phone: true,
        address: true,
        status: true,
        createdAt: true,
        items: { select: { amount: true } },
      },
    }),
    db.order.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="stack">
      <PageHeader title="Захиалга">
        Ирсэн хүсэлтүүд. Хэрэглэгчтэй холбогдож үнэ, цагийг тохирсны дараа төлвийг шинэчилнэ.
      </PageHeader>

      <form className="row card" method="get">
        <div className="field">
          <label htmlFor="q">Утас эсвэл дугаар</label>
          <input id="q" name="q" className="input" defaultValue={q} inputMode="numeric" />
        </div>
        <div className="field">
          <label htmlFor="status">Төлөв</label>
          <select id="status" name="status" className="input" defaultValue={status ?? ''}>
            <option value="">Бүгд</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">
          Хайх
        </button>
      </form>

      {orders.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">№</th>
                <th scope="col">Огноо</th>
                <th scope="col">Утас</th>
                <th scope="col">Хаяг</th>
                <th scope="col">Дүн</th>
                <th scope="col">Төлөв</th>
                <th scope="col">
                  <span className="sr-only">Үйлдэл</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.number}>
                  <td>
                    <Link href={`/admin/orders/${order.number}`}>#{order.number}</Link>
                  </td>
                  <td>{formatUbDateTime(order.createdAt)}</td>
                  <td>{order.phone}</td>
                  <td className={styles.truncate}>{order.address}</td>
                  <td>
                    {formatEstimate(
                      order.items.map((item) => item.amount),
                      mn.prices.onRequest,
                    )}
                    <span className="muted"> · {order.items.length} мөр</span>
                  </td>
                  <td>
                    <span className={`badge ${styles[`status${order.status}`]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/orders/${order.number}`}
                      className="btn btn-secondary btn-small"
                    >
                      Дэлгэрэнгүй
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="card muted">{q || status ? 'Илэрц олдсонгүй.' : 'Захиалга ирээгүй байна.'}</p>
      )}

      {pages > 1 && (
        <nav className="row" aria-label="Хуудаслалт">
          {page > 1 && (
            <Link href={pageHref({ q, status }, page - 1)} className="btn btn-secondary">
              ← Өмнөх
            </Link>
          )}
          <span className="muted">
            {page} / {pages}
          </span>
          {page < pages && (
            <Link href={pageHref({ q, status }, page + 1)} className="btn btn-secondary">
              Дараах →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
