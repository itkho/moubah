import react from "@vitejs/plugin-react";
import { UserConfig, ConfigEnv } from "vite";
import { join } from "path";

const rendererRoot = join(__dirname, "renderer");

export default ({ command }: ConfigEnv): UserConfig => {
    // DEV
    if (command === "serve") {
        return {
            root: rendererRoot,
            base: "/",
            plugins: [react()],
            resolve: {
                alias: {
                    "/@": rendererRoot,
                },
            },
            build: {
                outDir: join(rendererRoot, "/out"),
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
        plugins: [react()],
        resolve: {
            alias: {
                "/@": rendererRoot,
            },
        },
        build: {
            outDir: join(rendererRoot, "/out"),
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
};
