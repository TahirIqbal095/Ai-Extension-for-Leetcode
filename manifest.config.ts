import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
    manifest_version: 3,
    version: "1.0.0",
    name: "LeetAid",
    description:
        "A chrome extension for leetcode to solve the problem by giving the tailored hints",

    action: {
        default_popup: "popup.html",
    },

    permissions: ["storage"],

    icons: {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png",
    },

    background: {
        service_worker: "src/background.js",
        type: "module",
    },

    content_scripts: [
        {
            js: ["src/content.tsx"],
            matches: ["https://leetcode.com/problems/*"],
        },
    ],
});
