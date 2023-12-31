import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
// import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // swc.vite({
    //   // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
    //   module: { type: 'nodenext' },
    // }),
  ],
  test: {
    environment: 'node',
    passWithNoTests: true,
    logHeapUsage: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
    },
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
    isolate: true,
    typecheck: {
      checker: 'tsc',
      tsconfig: './tsconfig.json',
    },
  },
})
