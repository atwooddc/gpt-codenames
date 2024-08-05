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
                    Welcome to GPT Codenames
                </h1>
                <p>
                    If you've played before, jump right in!
                    <br />
                </p>
                <p>
                    If not, check out the rules below or in{" "}
                    <i>
                        <a href="https://czechgames.com/files/rules/codenames-rules-en.pdf">
                            the official rulebook
                        </a>
                    </i>
                    .<br />
                    <br />
                </p>

                <div className="buttons mb-4">
                    <button
                        className="mx-2 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={toggleRules}
                    >
                        Rules
                    </button>
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
                {showRules && (
                    <div
                        className="rules-container overflow-auto mt-4 p-4 bg-gray-100 border-t border-gray-300"
                        style={{ height: "40%" }}
                    >
                        <p>
                            <b>Objective:</b> As the spymaster for the blue
                            team, your goal is to help your AI teammates guess
                            all the blue words on the board before the red team
                            does.
                        </p>
                        <p>
                            <b>Setup:</b> You'll see a grid of 25 words. Each
                            word is a codename representing a potential blue
                            agent, red agent, innocent bystander, or the
                            assassin.
                        </p>
                        <p>
                            <b>Your Role:</b> You have access to a key card that
                            shows which words on the grid correspond to blue
                            agents. The red team's words, the innocent
                            bystanders, and the assassin's identity remain
                            hidden to you.
                        </p>
                        <p>
                            <b>Playing the Game:</b> Create a Clue: Each turn,
                            you must provide a one-word clue and a number. The
                            clue should relate to as many blue words as possible
                            on the board, and the number indicates how many
                            words relate to your clue. For example, if the words
                            "Moon" and "Star" are blue words, you might say
                            "Space, 2".
                        </p>
                        <p>
                            <b>Watch AI Guess:</b> After submitting your clue,
                            your AI teammate will guess the words. They will
                            continue guessing based on your clue until they
                            reach the number you provided, make a wrong guess,
                            or choose to pass.
                        </p>
                        <p>
                            <b>End of Turn:</b> The turn ends immediately if the
                            AI guesses a word that is not blue, or if they
                            choose to pass. Be careful not to lead your team to
                            guess the word that corresponds to the assassin, as
                            this will end the game with a loss for your team.
                        </p>
                        <p>
                            <b>Game End:</b> The game continues with each team
                            taking turns. The first team to correctly identify
                            all their agents wins. If a team guesses the
                            assassin word, they lose immediately.
                        </p>
                        <p>
                            <b>Good Luck!</b>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntroPopUp;
