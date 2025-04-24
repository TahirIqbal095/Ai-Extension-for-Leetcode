import { useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal, Maximize2, Minimize2, Bot, ChevronDown } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { ModelService } from "@/services/ModalService";
import { ChatHistory } from "@/interface/chatHistory";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const GEMINI_API = import.meta.env.VITE_GOOGLE_GEMINI_KEY;

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

type ChatWindowProps = {
    code: string;
    systemPrompt: string;
    prompt: string;
    setPrompt: (prompt: string) => void;
};

export function ChatWindow({ setPrompt, prompt, systemPrompt, code }: ChatWindowProps) {
    const [maximize, setMaximize] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const submitBtn = useRef<HTMLButtonElement>(null);

    // debouncing the 'setUserPrompt'
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPrompt(value);
        }, 900);

        return () => clearTimeout(timeoutId);
    }, [value, setPrompt]);

    /**
     * Handling the response from AI
     */
    const handleAiResponse = async (): Promise<void> => {
        const modelService = new ModelService();
        modelService.selectModel(GEMINI_API, "gemini-2.0-flash-001");

        const { error, success } = await modelService.generate({
            prompt: prompt,
            systemPrompt: systemPrompt,
            extractedCode: code,
        });

        if (success) {
            const res: ChatHistory = {
                role: "assistant",
                content: success,
            };

            setChatHistory((prev) => [...prev, res]);
        }

        if (error) {
            console.log(error);
        }
    };

    const handleSendmessage = async (value: string) => {
        const newMsg: ChatHistory = { role: "user", content: value };
        setChatHistory((prev) => [...prev, newMsg]);
    };

    // Function to handle Enter key press
    function handleEnterKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (submitBtn.current) {
                submitBtn.current.click();
            }
        }
    }

    return (
        <div
            style={{
                width: maximize ? "600px" : "360px",
                height: "500px",
            }}
            className="content-container"
        >
            <nav className="content-navbar">
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
            </nav>

            <section className="content-chat">
                {chatHistory &&
                    chatHistory.map((chat, idx) => (
                        <article key={idx}>
                            {chat.role === "user" && typeof chat.content === "string" && (
                                <div className="user-chat-container">
                                    <div className="user-chat">{<div>{chat.content}</div>}</div>
                                </div>
                            )}
                            {chat.role === "assistant" && typeof chat.content === "object" && (
                                <div className="ai-response">
                                    <div>{chat.content.feedback}</div>
                                    <div className="hints">
                                        <Accordion className="accordion" type="single" collapsible>
                                            {chat.content.hints?.map((hint, idx) => (
                                                <AccordionItem
                                                    key={idx}
                                                    value={`hint ${idx}`}
                                                    className="accordion-item"
                                                >
                                                    <AccordionTrigger className="accordion-trigger">
                                                        <span>Hint {idx + 1}</span>
                                                    </AccordionTrigger>

                                                    <AccordionContent className="accordion-content">
                                                        {hint}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
            </section>
            <form className="content-form">
                <div className="textarea-container">
                    <Textarea
                        value={value}
                        placeholder="Ask for a Hint"
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleEnterKeyPress}
                    />
                </div>
                <button
                    ref={submitBtn}
                    onClick={(e) => {
                        if (value.trim().length === 0) return;

                        e.preventDefault();
                        setValue("");
                        handleAiResponse();
                        handleSendmessage(value);
                    }}
                    className="content-send-btn"
                >
                    <SendHorizontal size={10} color="#f5f5f5" />
                </button>
            </form>
        </div>
    );
}
