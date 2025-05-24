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
// import { BriefcaseBusiness, SquareArrowOutUpRight } from "lucide-react";
import { z } from "zod";

export const ResponseRenderer = (content: z.infer<typeof outputSchema>) => {
    return (
        <div className="ai-response">
            <div>
                <div>
                    <ReactMarkdown>{content.feedback.response}</ReactMarkdown>
                </div>
                {/* {content.feedback.links &&
                    content.feedback.links.profile_picture &&
                    content.feedback.links.github &&
                    content.feedback.links.linkedin && (
                        <div className="dev-card">
                            <div className="about-container">
                                <div className="img-container">
                                    <img src={content.feedback.links.profile_picture} alt="img" />
                                </div>
                                <div className="dev-info">
                                    <h1 style={{ color: "#262626" }}>Tahir Iqbal</h1>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.2rem",
                                        }}
                                    >
                                        <BriefcaseBusiness size={10} color="#a3a3a3" />
                                        <p style={{ fontSize: "10px", color: "#a3a3a3" }}>
                                            Software and AI Engineer
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="socials">
                                <a href={content.feedback.links.github} target="_blank">
                                    <span style={{ fontSize: "10px", color: "#737373" }}>
                                        Github
                                    </span>
                                    <SquareArrowOutUpRight size={10} color="#737373" />
                                </a>
                                <a href={content.feedback.links.linkedin} target="_blank">
                                    <span style={{ fontSize: "10px", color: "#737373" }}>
                                        LinkedIn
                                    </span>
                                    <SquareArrowOutUpRight size={10} color="#737373" />
                                </a>
                            </div>
                        </div>
                    )} */}
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
