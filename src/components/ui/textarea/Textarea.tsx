import "./textarea.css";
import * as React from "react";

function Textarea({ ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className="content-textarea"
            {...props}
        />
    );
}

export { Textarea };
