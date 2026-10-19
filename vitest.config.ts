import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Серверийн модулийг unit тестэд ачаалах боломжтой болгоно.
      'server-only': path.resolve(__dirname, 'src/test/empty.ts'),
    },
  },
});
