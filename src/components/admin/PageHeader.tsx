import type { ReactNode } from 'react';

/** Админы хуудасны гарчиг ба товч тайлбар */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="stack">
      <h1>{title}</h1>
      {children && <p className="muted">{children}</p>}
    </header>
  );
}
