import { ValidModel } from "@/constants/valid_models";
import {
    GenerateResponseParamsType,
    GenerateResponseReturnType,
    ModelInterface,
} from "@/interface/ModalInterface";
import { createXai } from "@ai-sdk/xai";
import { generateObjectResponse } from "./utils";

export class Grok_3 implements ModelInterface {
    name: ValidModel = "grok-3";
    private apiKey: string = "";

    init(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async generateResponse(props: GenerateResponseParamsType): GenerateResponseReturnType {
        const xAi = createXai({
            apiKey: this.apiKey,
        });

        try {
            const data = await generateObjectResponse({
                systemPrompt: props.systemPrompt,
                prompt: props.prompt,
                extractedCode: props.extractedCode,
                model: xAi(this.name),
                messages: props.messages,
            });

            return { error: null, success: data.object };
        } catch (error) {
            return { error, success: null };
        }
    }
}
