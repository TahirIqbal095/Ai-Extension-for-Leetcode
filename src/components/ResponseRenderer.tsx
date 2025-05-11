import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { outputSchema } from "@/schema/outputMode";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { z } from "zod";

export const ResponseRenderer = (content: z.infer<typeof outputSchema>) => {
    return (
        <div className="ai-response">
            <div>
                <ReactMarkdown>{content.feedback}</ReactMarkdown>
            </div>

            {content.snippet && (
                <div style={{ marginTop: "1rem" }}>
                    <SyntaxHighlighter language="javascript" style={materialDark}>
                        {content.snippet}
                    </SyntaxHighlighter>
                </div>
            )}

            {content.hints && (
                <div className="hints">
                    <Accordion className="accordion" type="single" collapsible>
                        {content.hints?.map((hint, idx) => (
                            <AccordionItem
                                key={idx}
                                value={`hint ${idx}`}
                                className="accordion-item"
                            >
                                <AccordionTrigger className="accordion-trigger">
                                    <h3 style={{ color: "#262626" }}>Hint {idx + 1}</h3>
                                </AccordionTrigger>

                                <AccordionContent className="accordion-content">
                                    <p>{hint}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
};
