import React, { useState } from "react";

const IntroPopUp = ({ onStart }) => {
    const [showRules, setShowRules] = useState(false);

    const toggleRules = () => {
        setShowRules(!showRules);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div
                className="bg-white p-8 rounded shadow-lg text-center max-w-prose z-1000"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
                <h1 className="text-3xl font-bold mb-4">
                    GPT Codenames
                </h1>
                <p>
                    <i>
                    a board game adapted to explore the word association capabilities of LLMs
                    </i>
                    <br />
                </p>

                <div className="buttons mt-4">
                    <button
                        className="mx-2 px-4 py-2 bg-green-600 text-white rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            onStart();
                        }}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroPopUp;
