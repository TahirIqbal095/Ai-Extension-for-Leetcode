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
import {
    getChatHistory,
    CHAT_HISTORY_KEY,
    addChatHistory,
    deleteChatHistory,
} from "@/lib/indexedDb";
import { useChromeStorage } from "@/hooks/useChromeStorage";
import { cardContent } from "@/constants/cardContent";
import { PromptCard } from "@/components/PromptCard";
import { DropDown } from "@/components/DropDown";

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
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const messageEndRef = useRef<HTMLDivElement>(null);

        console.log("ChatWindow rendered", isLoading);

        const { getSelectedModel, getkeyAndModel } = useChromeStorage();

        /**
         * Fetching chat history from IndexedDB
         * and setting it to the state
         */
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

            const model = await getSelectedModel();
            if (!model) {
                return;
            }

            const { apiKey } = await getkeyAndModel(model);
            modelService.selectModel(apiKey, model);

            setIsLoading(true);

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
                setIsLoading(false);
            }

            if (error) {
                const errmessage: ChatHistory = {
                    role: "assistant",
                    content: "I couldn't get a response from the server. Please try again.",
                };

                setChatHistory((prev) => [...prev, errmessage]);
                console.error("Error:", error);
                setIsLoading(false);
            }
        };

        const submitPrompt = () => {
            if (value.trim() === "") {
                return;
            }
            setPrompt(value);
            const newMsg: ChatHistory = { role: "user", content: value };

            setChatHistory((prev) => [...prev, newMsg]);

            handleAiResponse();
            setValue("");
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            submitPrompt();
        };

        // Function to handle Enter key press
        function handleEnterKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitPrompt();
            }
        }

        const handlePromptCardClick = (e: React.MouseEvent<HTMLSpanElement>, text: string) => {
            e.preventDefault();
            setPrompt(text);
            setChatHistory((prev) => [...prev, { role: "user", content: text }]);

            handleAiResponse();
        };

        const clearChatHistory = () => {
            setChatHistory([]);
            deleteChatHistory(CHAT_HISTORY_KEY);
        };

        return (
            <div
                style={{
                    width: maximize ? "500px" : "360px",
                    height: maximize ? "520px" : "500px",
                }}
                className="content-container"
            >
                <nav className="content-navbar">
                    <div className="content-navbar-left">
                        <img
                            src="https://repository-images.githubusercontent.com/98157751/7e85df00-ec67-11e9-98d3-684a4b66ae37"
                            alt="img"
                        />
                        <h1 style={{ fontSize: "14px", fontWeight: "600", color: "#262626" }}>
                            LeetAid
                        </h1>
                    </div>
                    <div className="content-navbar-right">
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
                        <DropDown clearChatHistory={clearChatHistory} />
                    </div>
                </nav>

                {chatHistory.length === 0 && (
                    <div className="prompt-card-container">
                        <div className="demo-prompt-container">
                            {cardContent.map((card) => (
                                <PromptCard
                                    icon={card.icon}
                                    text={card.text}
                                    lineClass={card.lineClass}
                                    handleClick={handlePromptCardClick}
                                />
                            ))}
                        </div>
                    </div>
                )}

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
                                        <div>{chat.content.snippet}</div>
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
