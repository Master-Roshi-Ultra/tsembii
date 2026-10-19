import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'uploads/**'] },
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Зургийг оруулах үед Sharp-аар WebP болгож багасгадаг тул next/image хэрэггүй.
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
export default config;
