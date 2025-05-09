/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = "gemini-2.0-flash-001" | "deepseek-chat";

export const VALID_MODELS = [
    {
        name: "gemini-2.0-flash-001",
        displayName: "Gemini Flash 2.0",
    },
    {
        name: "deepseek-chat",
        displayName: "Deepseek R1",
    },
];
