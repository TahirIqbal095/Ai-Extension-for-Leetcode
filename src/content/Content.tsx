import { useEffect, useMemo, useRef, useState } from "react";
import { Bot } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { generateResponseFromGemini } from "@/models/gemini_2.0";

export default function Content() {
    const [code, setCode] = useState("");
    const language = useRef("unknown");

    // Extract code and language after 5 seconds
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const codeNodes = document.querySelectorAll(
                ".lines-content .view-lines .view-line"
            );
            const langButton = document.querySelector(
                "button.rounded.items-center.whitespace-nowrap.focus\\:outline-none.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.dark\\:text-text-secondary.active\\:bg-transparent.dark\\:active\\:bg-dark-transparent.hover\\:bg-fill-secondary.dark\\:hover\\:bg-fill-secondary.px-1\\.5.py-0\\.5.text-sm.font-normal.group"
            );

            language.current = langButton
                ? extractTextContent(langButton)
                : "unknown";
            setCode(extractCode(codeNodes));
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    // Extract problem statement
    const problemStatement = useMemo(() => {
        return (
            document
                .querySelector("meta[name=description]")
                ?.getAttribute("content") || "unknown"
        );
    }, []);

    // Update the system prompt with dynamic context
    const systemPromptWithContext = useMemo(() => {
        const escape = (str: string) => str.replace(/\$/g, "$$$$");
        return SYSTEM_PROMPT.replace(
            /{{problem_statement}}/gi,
            escape(problemStatement)
        )
            .replace(/{{user_code}}/gi, escape(code))
            .replace(/{{programming_language}}/gi, escape(language.current));
    }, [problemStatement, code, language]);

    // Handle AI Response
    const handleAiResponse = async () => {
        try {
            const response = await generateResponseFromGemini(
                systemPromptWithContext
            );
            console.log(response);
        } catch (error) {
            console.error("Failed to generate response:", error);
        }
    };

    return (
        <div className="absolute right-6 bottom-6">
            <div className="bg-white p-2 rounded shadow-md">
                <button
                    onClick={handleAiResponse}
                    className="cursor-pointer"
                    title="Ask AI"
                >
                    <Bot color="#000000" />
                </button>
            </div>
        </div>
    );
}
