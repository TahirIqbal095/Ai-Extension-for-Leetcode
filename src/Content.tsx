import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Content from "./content/Content";

const root = document.createElement("div");
root.id = "content-root";
document.body.appendChild(root);

createRoot(root).render(
    <StrictMode>
        <Content />
    </StrictMode>
);
