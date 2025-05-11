import { EllipsisVertical, MessageSquareCode, Trash } from "lucide-react";

export const DropDown = ({ clearChatHistory }: { clearChatHistory: () => void }) => {
    return (
        <div className="dropdown">
            <button className="ellipsis-container">
                <EllipsisVertical size={12} color="#262626" />
            </button>
            <div className="dropdown-menu">
                <div className="dropdown-item" onClick={clearChatHistory}>
                    <Trash size={16} color="#ea580c" />
                    <p>Clear Chat</p>
                </div>
                <a href="mailto:shahtahir786@gmail.com" className="dropdown-item">
                    <MessageSquareCode size={16} color="#16a34a" />
                    <p>Feedback</p>
                </a>
            </div>
        </div>
    );
};
