import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea/Textarea";
import { ModelService } from "@/services/ModalService";
import { ChatHistory, parseChatHistory } from "@/interface/chatHistory";
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
import { ResponseRenderer } from "@/components/ResponseRenderer";
import { SquareLoader } from "react-spinners";
import { ValidModel } from "@/constants/valid_models";
import { CoreMessage } from "ai";
import { testApi } from "@/utils/apiTest";

type ChatWindowProps = {
    code: string;
    systemPrompt: string;
    prompt: string;
    open: boolean;
    setPrompt: (prompt: string) => void;
};

export const ChatWindow = ({ setPrompt, prompt, systemPrompt, code, open }: ChatWindowProps) => {
    const [maximize, setMaximize] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [parsedChat, setParsedChat] = useState<CoreMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<ValidModel | null>(null);
    const [api, setApi] = useState<string | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const { getSelectedModel, getkeyAndModel } = useChromeStorage();

    useEffect(() => {
        try {
            const fetchChatHistory = async () => {
                const data = await getChatHistory(CHAT_HISTORY_KEY);

                if (!data) return;
                setChatHistory((prev) => [...prev, ...data]);
                const parsedMessages = parseChatHistory(data);
                setParsedChat((prev) => [...prev, ...parsedMessages]);
            };

            const fetchModelAndKey = async () => {
                const model = await getSelectedModel();
                if (!model) {
                    return;
                }
                const { apiKey } = await getkeyAndModel(model);
                if (!apiKey) {
                    return;
                }
                setSelectedModel(model);
                setApi(apiKey);
            };

            fetchChatHistory();
            fetchModelAndKey();
        } catch (error) {
            console.error("Error fetching chat history or model:", error);
        }

        setTimeout(() => {
            textareaRef.current?.focus();
        }, 0);
    }, []);

    useEffect(() => {
        const saveChatHistory = async () => {
            await addChatHistory(CHAT_HISTORY_KEY, chatHistory);
        };

        saveChatHistory();
    }, [chatHistory]);

    const handleAiResponse = async (messages: CoreMessage[]): Promise<void> => {
        if (!selectedModel || !api) {
            return;
        }
        setIsLoading(true);

        const validApi = await testApi(api, selectedModel);
        if (!validApi) {
            const errMessage: ChatHistory = {
                role: "assistant",
                content: {
                    feedback: {
                        response: "Invalid API, please check your API key.",
                    },
                },
            };
            setChatHistory((prev) => [...prev, errMessage]);
            setIsLoading(false);
            return;
        }

        const modelService = new ModelService();
        modelService.selectModel(api, selectedModel);

        console.log("parsed chat : ", parsedChat);

        const { error, success } = await modelService.generate({
            prompt: prompt,
            systemPrompt: systemPrompt,
            extractedCode: code,
            messages,
        });

        if (success) {
            const res: ChatHistory = {
                role: "assistant",
                content: success,
            };

            setChatHistory((prev) => [...prev, res]);
            setParsedChat((prev) => [
                ...prev,
                { role: "assistant", content: JSON.stringify(success) },
            ]);
            setIsLoading(false);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 0);
        }

        if (error) {
            const errMessage: ChatHistory = {
                role: "assistant",
                content: {
                    feedback: {
                        response: "Something went wrong, please try again.",
                    },
                },
            };

            setChatHistory((prev) => [...prev, errMessage]);
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    const submitPrompt = () => {
        const value = textareaRef.current?.value || "";
        if (!value.trim()) {
            return;
        }

        setPrompt(value);
        const newMessage: ChatHistory = {
            role: "user",
            content: value,
        };
        setChatHistory((prev) => [...prev, newMessage]);
        setParsedChat((prev) => [...prev, { role: "user", content: value }]);

        const latestMessages: CoreMessage[] = [...parsedChat, { role: "user", content: value }];
        handleAiResponse(latestMessages);
        textareaRef.current!.value = "";
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
        setParsedChat((prev) => [...prev, { role: "user", content: text }]);

        handleAiResponse([...parsedChat, { role: "user", content: text }]);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
        setParsedChat([]);
        deleteChatHistory(CHAT_HISTORY_KEY);
    };

    useEffect(() => {
        // for scrolling to the bottom of the chat
        if (isLoading && loaderRef.current) {
            loaderRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, isLoading]);

    useEffect(() => {
        if (open && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [open]);

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
                    <DropDown clearChatHistory={clearChatHistory} apiKey={api} />
                </div>
            </nav>

            {selectedModel && api ? (
                <>
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
                                            <div className="user-chat">
                                                <p>{chat.content}</p>
                                            </div>
                                        </div>
                                    )}
                                    {chat.role === "assistant" &&
                                        typeof chat.content === "object" && (
                                            <ResponseRenderer
                                                feedback={chat.content.feedback}
                                                hints={chat.content.hints}
                                                snippet={chat.content.snippet}
                                            />
                                        )}
                                </article>
                            ))}

                        {isLoading && (
                            <div className="loader-container" ref={loaderRef}>
                                <SquareLoader color="#2563eb" size={18} />
                                <p style={{ color: "#262626", fontSize: "12px" }}>Thinking...</p>
                            </div>
                        )}

                        <div ref={messageEndRef} />
                    </section>
                    <form className="content-form" onSubmit={(e) => handleSubmit(e)}>
                        <div className="textarea-container">
                            <Textarea
                                ref={textareaRef}
                                placeholder="Ask for a Hint"
                                onKeyDown={handleEnterKeyPress}
                            />
                        </div>
                        <button type="submit" className="content-send-btn">
                            <SendHorizontal size={10} color="#f5f5f5" />
                        </button>
                    </form>
                </>
            ) : (
                <div className="content-no-model">
                    <h1 style={{ fontSize: "16px", fontWeight: "600", color: "#262626" }}>
                        Please configure the extension
                    </h1>
                    <p>Go to the extension popup and select a model and enter your API key.</p>
                </div>
            )}
            <div className="blob-effect effect-1" />
            <div className="blob-effect effect-2" />
        </div>
    );
};
