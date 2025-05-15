import { ValidModel } from "@/constants/valid_models";

export const useChromeStorage = () => {
    return {
        setKeyAndModel: async (apiKey: string, model: ValidModel) => {
            chrome.storage.local.set({ [model]: apiKey });
        },

        getkeyAndModel: async (model: ValidModel) => {
            const result = await chrome.storage.local.get(model);
            return { model: model, apiKey: result[model] as string };
        },

        setSelectedModel: async (model: ValidModel) => {
            await chrome.storage.local.set({ ["selectedModel"]: model });
        },

        getSelectedModel: async () => {
            const result = await chrome.storage.local.get("selectedModel");
            return result["selectedModel"] as ValidModel;
        },
    };
};
