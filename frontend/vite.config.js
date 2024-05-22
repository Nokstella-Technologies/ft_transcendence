import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default ({ mode }) => {
    // Load app-level env vars to node-level env vars.
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    
    return defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '~bootstrap': 'node_modules/bootstrap',
            },
        },
        server: {
            port: 3000,
        },
    });
}
