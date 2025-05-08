import { ValidModel } from "@/constants/valid_models";
import {
    GenerateResponseParamsType,
    GenerateResponseReturnType,
    ModelInterface,
} from "@/interface/ModalInterface";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateObjectResponse } from "./utils";

export class Deepseek_Prover_v2 implements ModelInterface {
    name: ValidModel = "deepseek-chat";
    private apiKey: string = "";

    init(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async generateResponse(props: GenerateResponseParamsType): GenerateResponseReturnType {
        const deepseek = createDeepSeek({
            apiKey: this.apiKey,
        });

        try {
            const data = await generateObjectResponse({
                systemPrompt: props.systemPrompt,
                prompt: props.prompt,
                extractedCode: props.extractedCode,
                model: deepseek(this.name),
            });

            return { error: null, success: data.object };
        } catch (error) {
            return { error, success: null };
        }
    }
}
