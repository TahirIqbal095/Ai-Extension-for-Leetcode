import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ChevronDown } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { ChatWindow } from "./ChatWindow";

export default function Content() {
    const [code, setCode] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const language = useRef("unknown");

    // Extract code and language after 5 seconds
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const codeNodes = document.querySelectorAll(".lines-content .view-lines .view-line");
            const langButton = document.querySelector(
                "button.rounded.items-center.whitespace-nowrap.focus\\:outline-none.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.dark\\:text-text-secondary.active\\:bg-transparent.dark\\:active\\:bg-dark-transparent.hover\\:bg-fill-secondary.dark\\:hover\\:bg-fill-secondary.px-1\\.5.py-0\\.5.text-sm.font-normal.group"
            );

            language.current = langButton ? extractTextContent(langButton) : "unknown";
            setCode(extractCode(codeNodes));
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    // Extract problem statement
    const problemStatement = useMemo(() => {
        return (
            document.querySelector("meta[name=description]")?.getAttribute("content") || "unknown"
        );
    }, []);

    // Update the system prompt with dynamic context
    const systemPromptWithContext = useMemo(() => {
        return SYSTEM_PROMPT.replace(/{{problem_statement}}/gi, problemStatement)
            .replace(/{{user_prompt}}/gi, prompt)
            .replace(/{{user_code}}/gi, code)
            .replace(/{{programming_language}}/gi, language.current);
    }, [problemStatement, code, language, prompt]);

    return (
        <>
            <div className="main-content-contaier">
                {open && (
                    <ChatWindow
                        setPrompt={setPrompt}
                        prompt={prompt}
                        systemPrompt={systemPromptWithContext}
                        code={code}
                    />
                )}

                <div className="icon-container">
                    <button onClick={() => setOpen(!open)} title="Ask AI" className="main-icon">
                        {open ? (
                            <ChevronDown size={16} color="#000000" />
                        ) : (
                            <Bot size={16} color="#000000" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
