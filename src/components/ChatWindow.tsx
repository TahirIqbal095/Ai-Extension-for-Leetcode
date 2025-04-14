import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type ChatWindowProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export function ChatWindow({ open, setOpen }: ChatWindowProps) {
    const [value, setValue] = useState<string>("");
    return (
        <div
            style={{
                width: "360px",
                height: "500px",
            }}
            className="relative bg-white mb-4 rounded-lg shadow-lg p-4"
        >
            <div className="flex justify-end">
                <button
                    onClick={() => setOpen(!open)}
                    className="text-sm bg-gradient-to-bl from-neutral-900 via-neutral-600 to-neutral-800 text-neutral-100 px-2 rounded-md shadow"
                >
                    close
                </button>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (value.trim().length === 0) return;
                    setValue("");
                }}
                className="absolute bottom-2 left-2 right-2"
            >
                <Textarea
                    placeholder="Ask for help..."
                    onChange={(e) => setValue(e.target.value)}
                />
            </form>
        </div>
    );
}
