import { ValidModel } from "@/constants/valid_models";
import { ModelInterface } from "@/interface/ModalInterface";
import { Gemini_2_0_flash } from "./gemini_2.0_flash";
import { Grok_3 } from "./grok_3";
import { Gpt_3_5_turbo } from "./gpt_3_5_turbo";

export const models: Record<ValidModel, ModelInterface> = {
    "gemini-2.0-flash-001": new Gemini_2_0_flash(),
    "grok-3": new Grok_3(),
    "gpt-3.5-turbo": new Gpt_3_5_turbo(),
};
