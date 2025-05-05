import { ChatHistory } from "@/interface/chatHistory";
import { openDB, DBSchema } from "idb";

interface ChatHistoryDB extends DBSchema {
    chats: {
        key: string;
        value: ChatHistory[];
    };
}

const dbPromsise = openDB<ChatHistoryDB>("chat-history-db", 1, {
    upgrade(db) {
        db.createObjectStore("chats");
    },
});

export const addChatHistory = async (key: string, chatHistory: ChatHistory[]): Promise<void> => {
    const db = await dbPromsise;
    await db.put("chats", chatHistory, key);
};

export const getChatHistory = async (key: string): Promise<ChatHistory[] | void> => {
    const db = await dbPromsise;
    const data = db.get("chats", key);

    if (!data) return [];

    return data;
};

export const CHAT_HISTORY_KEY = "chat-history";
