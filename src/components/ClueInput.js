import React, { useState } from "react";

const ClueInput = ({ onSubmitClue, show, words, numCodenamesClued }) => {
    const [clue, setClue] = useState("");
    const [hasSpace, setHasSpace] = useState(false);
    const [isInvalidWord, setIsInvalidWord] = useState(false);

    const handleClueChange = (e) => {
        const value = e.target.value;
        setClue(value);
        setHasSpace(/\s/.test(value));
        setIsInvalidWord(words.includes(value.toUpperCase()));
    };

    const handleSubmit = () => {
        onSubmitClue(clue, numCodenamesClued);
        setClue("");
        setHasSpace(false);
        setIsInvalidWord(false);
    };

    return (
        <div
            className={`flex flex-col space-y-4 items-center ${
                show ? "" : "invisible"
            }`}
        >
            <div className="flex items-center space-x-4 h-8">
                <input
                    type="text"
                    value={clue}
                    onChange={handleClueChange}
                    className={`border-4 p-2 rounded ${
                        hasSpace || isInvalidWord
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    placeholder="One-word clue"
                />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    disabled={
                        numCodenamesClued === 0 ||
                        hasSpace ||
                        clue.trim() === "" ||
                        clue.length > 46 ||
                        isInvalidWord
                    }
                >
                    Submit
                </button>
            </div>
            {
                <p className="text-gray-500 italic">
                    {clue
                        ? numCodenamesClued
                            ? `clueing ${numCodenamesClued} codename${
                                  numCodenamesClued === 1 ? "" : "s"
                              }`
                            : "Select codenames you are clueing."
                        : "Enter clue"}
                </p>
            }
        </div>
    );
};

export default ClueInput;
