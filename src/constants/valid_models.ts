/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = "gemini-2.0-flash-001" | "grok-3" | "gpt-3.5-turbo";

export const VALID_MODELS = [
    {
        name: "gemini-2.0-flash-001",
        displayName: "Gemini Flash 2.0",
    },
    {
        name: "grok-3",
        displayName: "Grok 3",
    },
    {
        name: "gpt-3.5-turbo",
        displayName: "GPT-3.5 Turbo",
    },
];
