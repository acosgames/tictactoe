import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
// import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // cssInjectedByJsPlugin(),
        // visualizer()
    ],
    clearScreen: false,
    build: {
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            input: "./game-client/index.jsx",
            output: {
                // manualChunks: undefined,
                entryFileNames: `client.bundle.js`
            },
        },
        outDir: "./builds",
    }
});
