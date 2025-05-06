import { useState, useRef, useEffect, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { ModelService } from "@/services/ModalService";
import { ChatHistory } from "@/interface/chatHistory";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Maximize2, Minimize2, SendHorizontal } from "lucide-react";
import { getChatHistory, CHAT_HISTORY_KEY, addChatHistory } from "@/lib/indexedDb";

const GEMINI_API = import.meta.env.VITE_GOOGLE_GEMINI_KEY;

type ChatWindowProps = {
    code: string;
    systemPrompt: string;
    prompt: string;
    setPrompt: (prompt: string) => void;
};

export const ChatWindow = forwardRef<HTMLTextAreaElement, ChatWindowProps>(
    ({ setPrompt, prompt, systemPrompt, code }, ref) => {
        const [maximize, setMaximize] = useState<boolean>(false);
        const [value, setValue] = useState<string>("");
        const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
        const messageEndRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const fetchChatHistory = async () => {
                const data = await getChatHistory(CHAT_HISTORY_KEY);

                if (!data) return;
                setChatHistory((prev) => [...prev, ...data]);
            };

            fetchChatHistory();
        }, []);

        useEffect(() => {
            // for scrolling to the bottom of the chat
            if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
            }

            const saveChatHistory = async () => {
                await addChatHistory(CHAT_HISTORY_KEY, chatHistory);
            };

            saveChatHistory();
        }, [chatHistory]);

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

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            setPrompt(value);
            const newMsg: ChatHistory = { role: "user", content: value };

            setChatHistory((prev) => [...prev, newMsg]);

            handleAiResponse();
            setValue("");
        };

        // Function to handle Enter key press
        function handleEnterKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                setPrompt(value);
                const newMsg: ChatHistory = { role: "user", content: value };

                setChatHistory((prev) => [...prev, newMsg]);

                handleAiResponse();
                setValue("");
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
                                            <Accordion
                                                className="accordion"
                                                type="single"
                                                collapsible
                                            >
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

                    <div ref={messageEndRef} />
                </section>
                <form className="content-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="textarea-container">
                        <Textarea
                            ref={ref}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Ask for a Hint"
                            onKeyDown={handleEnterKeyPress}
                        />
                    </div>
                    <button type="submit" className="content-send-btn">
                        <SendHorizontal size={10} color="#f5f5f5" />
                    </button>
                </form>
            </div>
        );
    }
);
