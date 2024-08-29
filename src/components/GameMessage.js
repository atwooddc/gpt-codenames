import React from "react";
import { GrCircleQuestion } from "react-icons/gr";
import "./GameMessage.css";

const GameMessage = ({ gameMessage, currentGuess, guessTeam, explanation }) => {

    const getBorderColor = () => {
        switch (guessTeam) {
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

    const interactiveMessage = () => {
        if (currentGuess && gameMessage.includes(currentGuess)) {
            const parts = gameMessage.split(currentGuess);
            return (
                <div className="flex items-center">
                    {parts[0]}
                    <span
                        className={`hover-tooltip font-mono mx-1 tracking-wider text-black relative group flex items-center`}
                    >
                        <span
                            className={`current-guess cursor-default mx-1 relative group flex items-center`}
                            style={{
                                fontSize: "clamp(0.5rem, 2vw, 1.1rem)",
                                zIndex: 10,
                                "--line-color": getBorderColor(),
                            }}
                        >
                            {currentGuess}
                        </span>
                        <span className={`question-icon -translate-y-px z-10`}>
                            <GrCircleQuestion className="mr-0.5 text-gray-400 inline-block" />
                            <div
                                id="tooltip-animation"
                                role="tooltip"
                                className="absolute z-10 invisible inline-block px-3 py-2 w-96 text-sm font-normal font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-gray-700"
                                style={{ top: "100%" }}
                            >
                                {explanation}
                            </div>
                        </span>
                    </span>
                    {parts[1]}
                </div>
            );
        } else {
            return gameMessage;
        }
    };

    return (
        <>
            {gameMessage && (
                <div className="text-lg h-8">{interactiveMessage()}</div>
            )}
        </>
    );
};

export default GameMessage;
