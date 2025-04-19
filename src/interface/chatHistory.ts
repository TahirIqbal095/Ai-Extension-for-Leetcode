import { outputSchema } from "@/schema/outputMode";
import { z } from "zod";

export type Roles = "system" | "user" | "assistant" | "tool";

export type ChatHistory = {
    role: Roles;
    content: z.infer<typeof outputSchema> | string;
};
