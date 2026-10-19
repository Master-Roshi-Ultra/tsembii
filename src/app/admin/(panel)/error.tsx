'use client';

/** Админы хэсгийн алдаа: цэс хэвээр үлдэж, зөвхөн агуулгын хэсэг солигдоно. */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="stack">
      <p className="notice notice-error">Алдаа гарлаа. Хуудсыг дахин ачаалж үзнэ үү.</p>
      <div>
        <button type="button" className="btn" onClick={reset}>
          Дахин оролдох
        </button>
      </div>
    </div>
  );
}
