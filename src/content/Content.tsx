import { useEffect, useMemo, useRef, useState } from "react";
import { BotMessageSquare, Send } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { Textarea } from "@/components/ui/textarea";
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
        const escape = (str: string) => str.replace(/\$/g, "$$$$");
        return SYSTEM_PROMPT.replace(
            /{{problem_statement}}/gi,
            escape(problemStatement)
        )
            .replace(/{{user_prompt}}/gi, userPrompt)
            .replace(/{{user_code}}/gi, escape(code))
            .replace(/{{programming_language}}/gi, escape(language.current));
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
                        open={open}
                        setOpen={setOpen}
                        setUserPrompt={setUserPrompt}
                        handleAiResponse={handleAiResponse}
                        response={aiResponse}
                    />
                )}

                <div className="flex justify-end">
                    <button
                        onClick={() => setOpen(!open)}
                        className="cursor-pointer bg-[#FFFFFF] p-2 rounded transition hover:scale-110"
                        title="Ask AI"
                    >
                        <BotMessageSquare color="#000000" className="p-0" />
                    </button>
                </div>
            </div>
        </>
    );
}

type ChatWindowProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    setUserPrompt: (prompt: string) => void;
    handleAiResponse: () => Promise<void>;
    response: string | undefined;
};

export function ChatWindow({
    open,
    setOpen,
    setUserPrompt,
    handleAiResponse,
    response,
}: ChatWindowProps) {
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
                width: "360px",
                height: "500px",
            }}
            className="flex flex-col bg-white mb-4 rounded-lg shadow-lg p-2"
        >
            <div className="flex justify-end">
                <button
                    onClick={() => setOpen(!open)}
                    className="content-btn"
                    title="Close"
                >
                    close
                </button>
            </div>

            <div>{response}</div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleAiResponse();
                }}
                className="relative mt-auto"
            >
                <Textarea
                    style={{
                        color: "#404040",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                    }}
                    placeholder="Ask for help..."
                    onChange={(e) => setValue(e.target.value)}
                />

                <button type="submit" className="absolute right-3 top-3">
                    <Send color="#525252" />
                </button>
            </form>
        </div>
    );
}
