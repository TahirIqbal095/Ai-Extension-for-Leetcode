import { ValidModel } from "@/constants/valid_models";
import { generateText, LanguageModelV1 } from "ai";
import { createXai } from "@ai-sdk/xai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Test the API by sending a simple prompt and checking if a response is received.
 * @param {LanguageModelV1} model - The language model to test.
 * @returns {Promise<boolean>} - Returns true if the API is working, false otherwise.
 */

const makeRequest = async (model: LanguageModelV1) => {
    try {
        const result = await generateText({
            model: model,
            prompt: "say a word 'ping'",
        });

        if (!result.text) return false;

        return true;
    } catch (error) {
        console.error("Error in makeRequest:", error);
        return false;
    }
};

export const testApi = (apiKey: string, modelName: ValidModel) => {
    switch (modelName) {
        case "gemini-2.0-flash-001": {
            const google = createGoogleGenerativeAI({
                apiKey,
            });
            try {
                return makeRequest(google(modelName));
            } catch (error) {
                console.error("Error in testApi:", error);
                return false;
            }
        }

        case "gpt-3.5-turbo": {
            const openAI = createOpenAI({
                apiKey,
            });
            return makeRequest(openAI(modelName));
        }

        case "grok-3": {
            const xAi = createXai({
                apiKey,
            });
            return makeRequest(xAi(modelName));
        }
    }
};
