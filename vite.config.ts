import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

import {visualizer} from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: 'localhost',
        port: 8080
    },
    plugins: [
        react(),
        visualizer()]
})
