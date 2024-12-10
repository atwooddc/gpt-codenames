// import resized Card components and ClueInput component

import React from "react";

const RulesPopUp = ({ closeRules }) => {
    const handleOverlayClick = (e) => {
        // Close popup only if the user clicks on the overlay (not the popup content)
        if (e.target === e.currentTarget) {
            closeRules();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
            onClick={handleOverlayClick}
        >
            <div
                className="relative bg-popup rounded-lg 
            shadow-lg w-full sm:w-4/5 lg:w-3/5 xl:w-2/5 
            p-6 mx-4 animate-slide-up"
            >
                {/* Close Button */}
                <button
                    onClick={closeRules}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Content */}
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                    How To Play
                </h2>
                <p className="text-gray-800 mb-4">
                    The board has 24 codenames:
                    <br />
                    <span className="font-bold">9 agents (blue)</span>
                    <br />
                    <span className="font-bold">8 enemy agents (red)</span>
                    <br />
                    <span className="font-bold">6 bystanders (grey)</span>
                    <br />
                    <span className="font-bold">1 assassin (black)</span>
                </p>
                <p className="text-gray-800 mb-4">
                    You&apos;re trying to help your AI teammate identify the 9
                    friendly agents (blue codenames) before the enemy team
                    guesses their 8 enemy agents (red).
                </p>
                <p className="text-gray-800 mb-4">
                    Each turn, you&apos;ll enter a one-word clue and select the
                    codenames that match your clue.
                </p>
                <p className="text-gray-800 mb-4">
                    Your AI teammate will guess codenames one by one based on
                    (1) your clue and (2) the number of selected words.
                </p>
                <p className="text-gray-800 mb-4">
                    A turn ends if the guesser selects a codename that is not
                    their team&apos;s, or they reach the selected number.
                </p>
                <p className="text-gray-800">
                    The first team to guess all their codenames wins. Guessing
                    the assassin results in an immediate loss.
                </p>
            </div>
        </div>
    );
};

export default RulesPopUp;
