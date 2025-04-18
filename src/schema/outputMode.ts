import { z } from "zod";

export const outputSchema = z.object({
    feedback: z
        .string()
        .describe(
            "short, personalized analysis of the user's code (if provided) highlighting mistakes, inefficiencies, or areas of improvement. Avoid generic explanations or restating the problem."
        ),
    hints: z
        .array(z.string())
        .max(2, "You can only provide up to 2 hints.")
        .optional()
        .describe("max 2 hints"),
    snippet: z
        .string()
        .optional()
        .describe("code snippet should be in format."),
});
