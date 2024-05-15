import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        // visualizer()
    ],
    clearScreen: false,
    build: {
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            input: "./game-client/index.jsx",
            output: {
                entryFileNames: `client.bundle.js`
            },
        },
        outDir: "./builds",
    }
});
