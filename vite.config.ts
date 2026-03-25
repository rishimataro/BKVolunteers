import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        base: './',
        server: {
            port: Number(env.PORT) || 3000,
        },
        plugins: [
            react({
                babel: {
                    plugins: [['babel-plugin-react-compiler']],
                },
            }),
            tsconfigPaths(),
        ],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/testing/setup-tests.ts',
            exclude: ['**/node_modules/**', '**/e2e/**'],
            include: ['src/**/*.test.{ts,tsx}'],
        },
        optimizeDeps: { exclude: ['fsevents'] },
        build: {
            rollupOptions: {
                external: ['fs/promises'],
                output: {
                    experimentalMinChunkSize: 3500,
                },
            },
        },
    };
});
