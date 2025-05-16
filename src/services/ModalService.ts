import { ValidModel } from "@/constants/valid_models";
import { GenerateResponseParamsType, ModelInterface } from "@/interface/ModalInterface";
import { models } from "@/modals";
import { outputSchema } from "@/schema/outputMode";
import { z } from "zod";

export class ModelService {
    private model: ModelInterface | null = null;

    selectModel(apiKey: string, modelName: ValidModel) {
        if (models[modelName]) {
            this.model = models[modelName];
            this.model.init(apiKey);
        } else {
            throw new Error(`Model ${modelName} not found`);
        }
    }

    async generate(props: GenerateResponseParamsType): Promise<
        Promise<{
            success: z.infer<typeof outputSchema> | null;
            error: unknown;
        }>
    > {
        if (!this.model) {
            throw new Error(`No model selected`);
        }

        return this.model.generateResponse(props);
    }
}
