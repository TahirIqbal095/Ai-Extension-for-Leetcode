import "./content.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Content from "@/content/Content";

const root = document.createElement("div");
root.id = "content-container";
document.body.append(root);

createRoot(root).render(
    <StrictMode>
        <Content />
    </StrictMode>
);
