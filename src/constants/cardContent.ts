import React from "react";
import { Code, Binary, ShieldQuestion } from "lucide-react";

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
    {
        icon: React.createElement(ShieldQuestion, { size: 20, color: "#a855f7" }),
        text: "Okay, but seriously who made you and why are you solving coding problems with me?",
        lineClass: "line3",
    },
];
