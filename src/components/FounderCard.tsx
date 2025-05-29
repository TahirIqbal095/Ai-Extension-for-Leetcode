import { BriefcaseBusiness, SquareArrowOutUpRight } from "lucide-react";

type FounderCardProps = {
    profile: string;
    github: string;
    linkedin: string;
};

function FounderCard(props: FounderCardProps) {
    return (
        <div className="dev-card">
            <div className="about-container">
                <div className="img-container">
                    <img src={props.profile} alt="img" />
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
                <a href={props.github} target="_blank">
                    <span style={{ fontSize: "10px", color: "#737373" }}>Github</span>
                    <SquareArrowOutUpRight size={10} color="#737373" />
                </a>
                <a href={props.linkedin} target="_blank">
                    <span style={{ fontSize: "10px", color: "#737373" }}>LinkedIn</span>
                    <SquareArrowOutUpRight size={10} color="#737373" />
                </a>
            </div>
        </div>
    );
}

export default FounderCard;
