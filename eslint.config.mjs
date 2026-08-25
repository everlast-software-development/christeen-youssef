import next from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // _legacy holds the pre-migration Vite components, kept only as a content
  // and markup reference. It is excluded from tsconfig and never compiled.
  globalIgnores([
    '.next/**',
    'out/**',
    'node_modules/**',
    '_legacy/**',
    'server/**',
  ]),
  ...next,
]);
