import React from "react";
import { Code, Binary } from "lucide-react";

export const cardContent = [
    {
        icon: React.createElement(Code, { size: 20, color: "#ea580c" }),
        text: "How can I improve my code? Please provide me with some hints.",
        lineClass: "line1",
    },
    {
        icon: React.createElement(Binary, { size: 20, color: "#16a34a" }),
        text: "What are the potential issues with my code?",
        lineClass: "line2",
    },
];
