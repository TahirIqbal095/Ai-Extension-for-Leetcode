import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal, Maximize2, Minimize2, Bot } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { generateResponseFromGemini } from "@/models/gemini_2.0";

export default function Content() {
    const [code, setCode] = useState<string>("");
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<string | undefined>("");
    const language = useRef("unknown");

    console.log("re-render");
    console.log(userPrompt);

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
        return SYSTEM_PROMPT.replace(
            /{{problem_statement}}/gi,
            problemStatement
        )
            .replace(/{{user_prompt}}/gi, userPrompt)
            .replace(/{{user_code}}/gi, code)
            .replace(/{{programming_language}}/gi, language.current);
    }, [problemStatement, code, language, userPrompt]);

    // Handle AI Response
    const handleAiResponse = async () => {
        try {
            const response = await generateResponseFromGemini(
                systemPromptWithContext
            );
            setAiResponse(response);
        } catch (error) {
            console.error("Failed to generate response:", error);
        }
    };

    return (
        <>
            <div
                className="z-50"
                style={{
                    position: "fixed",
                    bottom: "28px",
                    right: "28px",
                }}
            >
                {open && (
                    <ChatWindow
                        setUserPrompt={setUserPrompt}
                        handleAiResponse={handleAiResponse}
                        response={aiResponse}
                    />
                )}

                <div className="icon-container">
                    <button
                        onClick={() => setOpen(!open)}
                        title="Ask AI"
                        className="main-icon"
                    >
                        <Bot size={16} color="#000000" />
                    </button>
                </div>
            </div>
        </>
    );
}

type ChatWindowProps = {
    setUserPrompt: (prompt: string) => void;
    handleAiResponse: () => Promise<void>;
    response: string | undefined;
};

export function ChatWindow({
    setUserPrompt,
    handleAiResponse,
    response,
}: ChatWindowProps) {
    const [maximize, setMaximize] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    // debouncing the 'setUserPrompt'
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setUserPrompt(value);
        }, 900);

        return () => clearTimeout(timeoutId);
    }, [value, setUserPrompt]);

    return (
        <div
            style={{
                width: maximize ? "600px" : "360px",
                height: "500px",
            }}
            className="content-container"
        >
            <div className="content-navbar">
                <button
                    onClick={() => setMaximize(!maximize)}
                    className="content-max-btn"
                    title={maximize ? "Minimize" : "Maximize"}
                >
                    {maximize ? (
                        <Minimize2 size={12} color="#262626" />
                    ) : (
                        <Maximize2 size={12} color="#262626" />
                    )}
                </button>
            </div>

            <div className="content-chat">{response}</div>

            <form
                action="submit"
                onSubmit={(event) => {
                    event.preventDefault();
                    handleAiResponse();
                }}
                className="content-form"
            >
                <Textarea
                    placeholder="Ask for help..."
                    onChange={(e) => setValue(e.target.value)}
                />

                <button type="submit" className="content-send-btn">
                    <SendHorizontal size={12} color="#f5f5f5" />
                </button>
            </form>
        </div>
    );
}
