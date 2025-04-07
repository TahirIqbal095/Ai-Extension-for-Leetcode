import { Bot } from "lucide-react";
import { extractCode } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";

export default function Content() {
    let PROBLEM_STATEMENT = "unknown";
    const currentProblem = document
        .querySelector("meta[name=description]")
        ?.getAttribute("content");

    if (currentProblem) {
        PROBLEM_STATEMENT = currentProblem;
    }

    const userCurrentCode = document.querySelectorAll(".view-line");
    const USER_CODE = extractCode(userCurrentCode);

    let CODING_LANGUAGE = "unknown";
    const changeLanguageButton = document.querySelector(
        "button.rounded.items-center.whitespace-nowrap.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.group"
    );

    if (changeLanguageButton) {
        if (changeLanguageButton.textContent) {
            CODING_LANGUAGE = changeLanguageButton.textContent;
        }
    }

    const systemPromptWithContext = SYSTEM_PROMPT.replace(
        /{{problem_statement}}}/gi, // replaces all problems_statement's (Case-insensitive)
        PROBLEM_STATEMENT
    )
        .replace(/{{user_code}}}/gi, USER_CODE)
        .replace(/{{programming_language}}}/gi, CODING_LANGUAGE);

    console.log(systemPromptWithContext);

    return (
        <div className="absolute right-6 bottom-6">
            <div className="bg-white p-2 rounded">
                <Bot color="#000000" />
            </div>
        </div>
    );
}
