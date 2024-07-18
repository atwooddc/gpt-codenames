import { React } from "react";

const Card = ({ wordObj }) => {
    const getBackgroundColor = () => {
        if (wordObj.isGuessed) {
            switch (wordObj.team) {
                case "user":
                    return "#17739e";
                case "computer":
                    return "#d81c2c";
                case "bystander":
                    return "#aeae99";
                default:
                    return "darkgrey";
            }
        }
        return "#cfbd94";
    };

    const getBorderColor = () => {
        if (!wordObj.isGuessed) {
            switch (wordObj.team) {
                case "user":
                    return "#17739e";
                case "computer":
                    return "#d81c2c";
                case "bystander":
                    return "#aeae99";
                default:
                    return "black";
            }
        }
        return "";
    };

    return (
        <div
            className={`flex items-center justify-center font-mono 
                  tracking-wider text-black uppercase 
                  rounded shadow-md transition-transform
                  ${!wordObj.isGuessed ? "hover:scale-105" : ""}
                  ${wordObj.isGuessed ? "text-black/30" : ""}`}
            style={{
                aspectRatio: "67 / 43",
                backgroundColor: getBackgroundColor(),
                borderColor: getBorderColor(),
                borderWidth: `${wordObj.isGuessed ? "0px" : "3px"}`,
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: "clamp(0.5rem, 1.5vw, 0.85rem)",
                // fontWeight: "bold",
                textTransform: "uppercase",
            }}
        >
            {wordObj.word}
        </div>
    );
};

export default Card;
