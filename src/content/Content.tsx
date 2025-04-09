import { Bot } from "lucide-react";
import { extractCode, extractTextContent } from "./utils";
import { SYSTEM_PROMPT } from "@/constants/prompt";
import { useEffect, useState } from "react";

export default function Content() {
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("");

    useEffect(() => {
        /**
         * extracting the language and the code written by the user
         * after 5-sec of delay
         */
        const timeoutId = setTimeout(() => {
            const userCurrentCode = document.querySelectorAll(
                ".lines-content .view-lines .view-line"
            );
            const languageButton = document.querySelector(
                "button.rounded.items-center.whitespace-nowrap.focus\\:outline-none.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.dark\\:text-text-secondary.active\\:bg-transparent.dark\\:active\\:bg-dark-transparent.hover\\:bg-fill-secondary.dark\\:hover\\:bg-fill-secondary.px-1\\.5.py-0\\.5.text-sm.font-normal.group"
            );

            if (languageButton) {
                setLanguage(extractTextContent(languageButton));
            }
            setCode(extractCode(userCurrentCode));
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, []);

    // extracting the problem-statement
    let PROBLEM_STATEMENT = "unknown";
    const currentProblem = document
        .querySelector("meta[name=description]")
        ?.getAttribute("content");

    if (currentProblem) {
        PROBLEM_STATEMENT = currentProblem;
    }

    // updating the prompt
    const systemPromptWithContext = SYSTEM_PROMPT.replace(
        /{{problem_statement}}}/gi, // replaces all problems_statement's (Case-insensitive)
        PROBLEM_STATEMENT
    )
        .replace(/{{user_code}}}/gi, code)
        .replace(/{{programming_language}}}/gi, language);

    console.log(systemPromptWithContext);

    return (
        <div className="absolute right-6 bottom-6">
            <div className="bg-white p-2 rounded">
                <Bot color="#000000" />
            </div>
        </div>
    );
}
