import { outputSchema } from "@/schema/outputMode";
import { CoreMessage } from "ai";
import { z } from "zod";

export type Roles = "system" | "user" | "assistant" | "tool";

export type ChatHistory = {
    role: Exclude<Roles, "tool">;
    content: z.infer<typeof outputSchema> | string;
};

export const parseChatHistory = (chatHistory: ChatHistory[]): CoreMessage[] => {
    return chatHistory.map((message) => ({
        role: message.role,
        content:
            typeof message.content === "string" ? message.content : JSON.stringify(message.content),
    }));
};
