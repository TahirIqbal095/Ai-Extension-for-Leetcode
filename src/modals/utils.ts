import { outputSchema } from "@/schema/outputMode";
import { generateObject, GenerateObjectResult, LanguageModelV1 } from "ai";

export const generateObjectResponse = async ({
    systemPrompt,
    prompt,
    extractedCode,
    model,
}: {
    systemPrompt: string;
    prompt: string;
    extractedCode?: string;
    model: LanguageModelV1;
}): Promise<
    GenerateObjectResult<{
        feedback: string;
        hints?: string[] | undefined;
        snippet?: string | undefined;
        programmingLanguage?: string | undefined;
    }>
> => {
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
        ],
    });

    return data;
};
