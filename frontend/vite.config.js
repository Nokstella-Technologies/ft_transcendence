import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
    // Load app-level env vars to node-level env vars.
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    
    return defineConfig({
      plugins: [react()],
        server: {
            port: 3000,
        },
    });
}
