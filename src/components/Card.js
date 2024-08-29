import React from "react";
import "./Card.css";

const Card = ({
    wordObj,
    clueInput,
    onHover,
    onHoverEnd,
    isHovered,
    onCardClick,
    isSelected,
}) => {
    const getBackgroundColor = () => {
        if (wordObj.isGuessed) {
            switch (wordObj.team) {
                case "user":
                    return "#17739e";
                // return "#458fb1"; // lighter hue
                case "computer":
                    return "#d81c2c";
                // return "#e04956"; // lighter hue
                case "bystander":
                    return "#aeae99";
                // return "#bebead"; // lighter hue
                default:
                    return "#4f4f4f"
            }
        }
        return "#cfbd94";
    };

    const getBorderColor = () => {
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
    };

    return (
        <div
            onMouseEnter={() => onHover(wordObj.team)}
            onMouseLeave={onHoverEnd}
            onClick={() => onCardClick(wordObj)}
            className={`card flex items-center justify-center font-mono 
                  tracking-wider text-black uppercase 
                  rounded shadow-md transition-transform cursor-default
                  ${wordObj.isGuessed ? "text-black/30" : ""}
                  ${isHovered ? "scale-105" : ""}
                  ${
                      wordObj.team === "user" && clueInput && !wordObj.isGuessed
                          ? "shimmer cursor-pointer"
                          : ""
                  }
                  ${isSelected && !wordObj.isGuessed ? "border-8" : ""}`}
            style={{
                aspectRatio: "67 / 43",
                backgroundColor: getBackgroundColor(),
                borderColor: getBorderColor(),
                borderWidth: `${
                    isSelected ? "8px" : wordObj.isGuessed ? "0px" : "3px"
                }`,
                borderRadius: "8px",
                // borderRadius: "4px",
                textAlign: "center",
                fontSize: "clamp(0.5rem, 1.5vw, 0.85rem)",
                textTransform: "uppercase",
            }}
        >
            {wordObj.word}
        </div>
    );
};

export default Card;
