import { outputSchema } from "@/schema/outputMode";
import { z } from "zod";

export abstract class ModalInterface {
    abstract name: string;

    abstract init(apiKey?: string): void;

    /**
     * Generates a response using the AI model.
     *
     * @returns A promise resolving to an object containing either:
     *  - `error`: Any error encountered during the API call.
     *  - `success`: The successful response data adhering to `outputSchema`.
     */
    abstract generateResponse(
        props: GenerateResponseParamsType
    ): GenerateResponseReturnType;
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
