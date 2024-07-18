import React, { useState } from "react";

const ClueInput = ({ onSubmitClue, show, words }) => {
    const [clue, setClue] = useState("");
    const [numCards, setNumCards] = useState(1);
    const [hasSpace, setHasSpace] = useState(false);
    const [isInvalidWord, setIsInvalidWord] = useState(false);

    const handleClueChange = (e) => {
        const value = e.target.value;
        setClue(value);
        setHasSpace(/\s/.test(value));
        setIsInvalidWord(words.includes(value.toUpperCase()));
    };

    const handleNumCardsChange = (e) => {
        setNumCards(e.target.value);
    };

    const handleSubmit = () => {
        if (!hasSpace && !isInvalidWord && clue.trim() !== "") {
            onSubmitClue(clue, numCards);
            setClue("");
            setNumCards(1);
            setHasSpace(false);
            setIsInvalidWord(false);
        }
    };

    return (
        <div
            className={`flex items-center space-x-4 h-8 ${
                show ? "" : "invisible"
            }`}
        >
            <input
                type="text"
                value={clue}
                onChange={handleClueChange}
                className={`border-4 p-2 rounded ${
                    hasSpace || isInvalidWord
                        ? "border-red-500"
                        : "border-gray-300"
                }`}
                placeholder="Enter one-word clue"
            />
            <input
                type="number"
                value={numCards}
                onChange={handleNumCardsChange}
                min="1"
                max="9"
                className="border-4 p-2 rounded border-gray-300"
            />
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={hasSpace || isInvalidWord || clue.trim() === ""}
            >
                Submit
            </button>
            {isInvalidWord && (
                <p className="text-red-500">
                    Clue cannot be one of the game words!
                </p>
            )}
        </div>
    );
};

export default ClueInput;
