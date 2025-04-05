import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";
import path from "path";
import { crx } from "@crxjs/vite-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        crx({ manifest }),
        viteStaticCopy({
            targets: [
                // Optionally, copy the entire src folder
                // { src: "src/*", dest: "src" },
                // Copy the background.js file to the dist/src folder
                { src: "src/background.js", dest: "src" },
                // Copy the manifest.json file to the root of the dist folder
                { src: "manifest.json", dest: "" },
            ],
        }),
    ],

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
