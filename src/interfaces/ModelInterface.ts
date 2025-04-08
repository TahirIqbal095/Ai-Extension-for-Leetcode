import { outputSchema } from "@/schema/output";
import { z } from "zod";

export abstract class ModalInterface {
    abstract name: string; // name for model

    /**
     * @param apiKey - The API key used to authenticate with the AI service.
     */
    abstract init(apiKey?: string): void;

    /**
     * Generates a response using the AI model.
     *
     * @param prompt - The main prompt provided by the user.
     * @param systemPrompt - A system-level instruction to guide the AI.
     * @param extractedCode - (Optional) A code snippet to assist the AI in its response.
     *
     * @returns A promise resolving to an object containing either:
     *  - `error`: Any error encountered during the API call.
     *  - `success`: The successful response data adhering to `outputSchema`.
     */
    abstract generateResponse(props: GenerateResponseParamsType): Promise<{
        error: Error | null;
        success: z.infer<typeof outputSchema> | null;
    }>;
}

/**
 * Defines the contract for AI modal implementations.
 */
export type GenerateResponseReturnType = Promise<{
    error: Error | null;
    success: z.infer<typeof outputSchema> | null;
}>;

/**
 * Defines the parameters for generating a response.
 */
export type GenerateResponseParamsType = {
    prompt: string;
    systemPrompt: string;
    extractedCode?: string;
};
