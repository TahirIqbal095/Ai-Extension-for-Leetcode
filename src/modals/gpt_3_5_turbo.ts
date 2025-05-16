import {
    GenerateResponseParamsType,
    GenerateResponseReturnType,
    ModelInterface,
} from "@/interface/ModalInterface";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObjectResponse } from "./utils";

export class Gpt_3_5_turbo implements ModelInterface {
    name: string = "gpt-3.5-turbo";
    private apiKey: string = "";

    init(apiKey?: string): void {
        this.apiKey = apiKey || "";
    }

    async generateResponse(props: GenerateResponseParamsType): GenerateResponseReturnType {
        const openai = createOpenAI({
            apiKey: this.apiKey,
        });

        try {
            const data = await generateObjectResponse({
                systemPrompt: props.systemPrompt,
                prompt: props.prompt,
                extractedCode: props.extractedCode,
                model: openai(this.name),
                messages: props.messages,
            });

            return { error: null, success: data.object };
        } catch (error) {
            return { error, success: null };
        }
    }
}
