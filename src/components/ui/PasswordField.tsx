'use client';

import { useState } from 'react';
import styles from './PasswordField.module.css';

/** Нууц үгийн талбар: «Харах» товчоор бичсэнээ шалгана. */
export function PasswordField({
  label,
  name,
  id = name,
  autoComplete = 'new-password',
  minLength,
}: {
  label: string;
  name: string;
  id?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={styles.wrap}>
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          className="input"
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible((v) => !v)}
          aria-controls={id}
          aria-pressed={visible}
        >
          {visible ? 'Нуух' : 'Харах'}
        </button>
      </div>
    </div>
  );
}
