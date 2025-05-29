import { z } from "zod";

export const outputSchema = z.object({
    feedback: z
        .object({
            response: z.string().describe("The feedback response."),
        })
        .describe(
            "The feedback is an object containing a response string. This is the main feedback from the AI. The response should be concise, personal, and directly address the user's prompt plus the context provided."
        ),
    hints: z
        .array(z.string())
        .max(2, "You can only provide up to 2 hints.")
        .optional()
        .describe("max 2 hints"),
    snippet: z.string().optional().describe("code snippet should be in format."),
    links: z
        .object({
            profile_picture: z
                .string()
                .describe("Link to the profile picture (e.g., GitHub avatar)."),
            github: z.string().describe("Link to the GitHub profile"),
            linkedin: z.string().describe("Link to the LinkedIn profile."),
        })
        .optional()
        .describe("Link to the profile picture, GitHub, and LinkedIn of a founder/creator."),
});
