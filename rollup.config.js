import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    input: "game-server/index.js",
    output: {
        format: "cjs",
        sourcemap: true,
        file: "builds/server.bundle.dev.js",
        // preserveModules: true,
    },
    plugins: [nodeResolve()],
    watch: {
        include: ["./game-server/*"],
        exclude: ["./game-client/*", "./builds"],
        clearScreen: false,
    },
};
