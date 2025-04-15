import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import tailwindcss from "@tailwindcss/vite";
import hotReloadExtension from "hot-reload-extension-vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        crx({
            manifest,
            contentScripts: {
                preambleCode: false,
            },
        }),
        hotReloadExtension({
            log: true,
            backgroundPath: "./src/background.js",
        }),
    ],

    build: {
        outDir: "dist",
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
