import react from "@vitejs/plugin-react";
import { UserConfig, ConfigEnv } from "vite";
import { join } from "path";

const rendererRoot = join(__dirname, "renderer");
const outDir = join(rendererRoot, "/out");

// TODO: clean this ⬇️ (a lot of things are not necessary here)
export default ({ command }: ConfigEnv): UserConfig => {
    // DEV
    if (command === "serve") {
        return {
            root: rendererRoot,
            base: "/",
            plugins: [
                react({
                    babel: {
                        // babel-macro is needed for lingui
                        plugins: ["macros"],
                    },
                }),
            ],
            resolve: {
                alias: {
                    "/@": rendererRoot,
                },
            },
            build: {
                outDir: outDir,
                emptyOutDir: true,
                rollupOptions: {},
            },
            server: {
                port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
            },
            optimizeDeps: {
                exclude: ["path"],
            },
        };
    }
    // PROD
    return {
        root: rendererRoot,
        base: "./",
        plugins: [
            react({
                babel: {
                    // babel-macro is needed for lingui
                    plugins: ["macros"],
                },
            }),
        ],
        resolve: {
            alias: {
                "/@": rendererRoot,
            },
        },
        build: {
            outDir: outDir,
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    index: join(rendererRoot, "index.html"),
                    splash: join(rendererRoot, "splash", "index.html"),
                },
            },
        },
        server: {
            port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
        },
        optimizeDeps: {
            exclude: ["path"],
        },
    };
};
