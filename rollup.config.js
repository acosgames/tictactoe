import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
    input: "game-server/index.js",
    output: {
        format: "cjs",
        sourcemap: true,
        file:
            process.env.NODE_ENV == "production"
                ? "builds/server.bundle.js"
                : "builds/server.bundle.dev.js",
        // preserveModules: true,
    },
    plugins: [nodeResolve(), terser()],
    watch: {
        include: ["./game-server/*"],
        exclude: ["./game-client/*", "./builds"],
        clearScreen: false,
    },
};
