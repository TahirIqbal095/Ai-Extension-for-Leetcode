import { ValidModel } from "@/constants/valid_models";
import { ModelInterface } from "@/interface/ModalInterface";
import { Gemini_2_0_flash } from "./gemini_2.0_flash";

export const models: Record<ValidModel, ModelInterface> = {
    "gemini-2.0-flash-001": new Gemini_2_0_flash(),
};
