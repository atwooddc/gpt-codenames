import React from "react";
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
                <>
                    {parts[0]}
                    <span
                        className={`current-guess font-mono tracking-wider text-black mx-1 relative group`}
                        style={{
                            fontSize: "clamp(0.5rem, 2vw, 1.1rem)",
                            zIndex: 10,
                            "--line-color": getBorderColor(),
                        }}
                    >
                        {currentGuess}
                        <div
                            id="tooltip-animation"
                            role="tooltip"
                            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-normal font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-gray-700"
                            style={{ top: '100%' }}
                        >
                            {explanation}
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                    </span>
                    {parts[1]}
                </>
            );
        } else {
            return gameMessage;
        }
    };

    return (
        <>
            {gameMessage && (
                <p className="text-lg h-8">{interactiveMessage()}</p>
            )}
        </>
    );
};

export default GameMessage;
