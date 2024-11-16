import React, { useState } from "react";

const Rules = () => {
    const [showRules, setShowRules] = useState(false);

    const handleMouseEnter = () => {
        setShowRules(true);
    };

    const handleMouseLeave = () => {
        setShowRules(false);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Button that grows into the pop-up */}
            <div
                className={`rules-button bg-blue-600 text-white rounded-lg flex items-center justify-center transition-all duration-1000 ease-in-out cursor-default ${
                    showRules ? "w-64 h-64 p-4 bg-white text-black" : "w-24 h-12 p-2"
                }`}
                style={{
                    transformOrigin: "bottom left", // Makes it grow from the bottom-left corner
                }}
            >
                {showRules ? (
                    <div className="text-left overflow-auto">
                        <p className="mb-2">
                            The board has 25 codenames: 9 blue agents (your team), 8 red agents (the GPT's team), 7 innocent bystanders (grey), and 1 assassin (black).
                        </p>
                        <p className="mb-2">
                            You're trying to help your AI teammate guess the 9 blue codenames before the other team guesses the 8 red ones.
                        </p>
                        <p className="mb-2">
                            Each turn, you'll enter a one-word clue and select the codenames that match your clue.
                        </p>
                        <p className="mb-2">
                            Your AI teammate will guess codenames one by one based on your clue and the number of selected words.
                        </p>
                        <p className="mb-2">
                            A turn ends if the guesser selects a word that is not their team's, or reaches the selected number.
                        </p>
                        <p>
                            The first team to guess all their codenames wins. Guessing the assassin results in an immediate loss.
                        </p>
                    </div>
                ) : (
                    <span className="whitespace-nowrap">Rules</span>
                )}
            </div>
        </div>
    );
};

export default Rules;
