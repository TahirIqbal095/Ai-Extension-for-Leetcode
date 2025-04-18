import {
    GenerateResponseParamsType,
    GenerateResponseReturnType,
    ModelInterface,
} from "@/interface/ModalInterface";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObjectResponse } from "./utils";
import { ValidModel } from "@/constants/valid_models";

export class Gemini_2_0_flash implements ModelInterface {
    name: ValidModel = "gemini-2.0-flash-001";
    private apiKey: string = "";

    init(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async generateResponse(
        props: GenerateResponseParamsType
    ): GenerateResponseReturnType {
        const google = createGoogleGenerativeAI({
            apiKey: this.apiKey,
        });
        try {
            const data = await generateObjectResponse({
                systemPrompt: props.systemPrompt,
                extractedCode: props.extractedCode,
                prompt: props.prompt,
                model: google(this.name),
            });

            return { error: null, success: data.object };
        } catch (error) {
            return { error, success: null };
        }
    }
}
