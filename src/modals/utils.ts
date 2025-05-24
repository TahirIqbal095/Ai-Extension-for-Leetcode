import { outputSchema } from "@/schema/outputMode";
import { CoreMessage, generateObject, GenerateObjectResult, LanguageModelV1 } from "ai";
import { z } from "zod";

export const generateObjectResponse = async ({
    systemPrompt,
    prompt,
    extractedCode,
    model,
    messages,
}: {
    systemPrompt: string;
    prompt: string;
    extractedCode?: string;
    model: LanguageModelV1;
    messages: CoreMessage[];
}): Promise<GenerateObjectResult<z.infer<typeof outputSchema>>> => {
    const data = await generateObject({
        schema: outputSchema,
        output: "object",
        model: model,
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "system",
                content: `extractedCode (this code is writen by user): ${extractedCode}`,
            },
            { role: "user", content: prompt },
            ...messages,
        ],
    });

    return data;
};
