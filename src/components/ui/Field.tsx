import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; name: string };

/** Шошготой input. `id` өгөөгүй бол `name`-ийг ашиглана. */
export function Field({ label, id, ...input }: InputProps) {
  const inputId = id ?? input.name;
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} className="input" {...input} />
    </div>
  );
}

export function TextAreaField({
  label,
  id,
  ...input
}: InputHTMLAttributes<HTMLTextAreaElement> & { label: ReactNode; name: string; rows?: number }) {
  const inputId = id ?? input.name;
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <textarea id={inputId} className="input" rows={3} {...input} />
    </div>
  );
}

export function SelectField({
  label,
  id,
  options,
  ...select
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode;
  name: string;
  options: Record<string, string>;
}) {
  const selectId = id ?? select.name;
  return (
    <div className="field">
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} className="input" {...select}>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({ label, ...input }: Omit<InputProps, 'type'>) {
  return (
    <label className="checkbox">
      <input type="checkbox" {...input} />
      <span>{label}</span>
    </label>
  );
}
