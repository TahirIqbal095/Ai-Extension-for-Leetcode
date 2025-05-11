import React from "react";

type PromptCardProps = {
    icon: React.ReactNode;
    text: string;
    lineClass: string;
    handleClick: (e: React.MouseEvent<HTMLSpanElement>, text: string) => void;
};

export const PromptCard = ({ icon, text, lineClass, handleClick }: PromptCardProps) => {
    return (
        <div className="promt-card">
            <span className="prompt-card-click" onClick={(e) => handleClick(e, text)} />
            <div>{icon}</div>
            <p
                style={{
                    fontSize: "0.2rem",
                    fontWeight: "normal",
                    color: "#262626",
                }}
            >
                {text}
            </p>
            <span className={`card-line ${lineClass}`} />
        </div>
    );
};
