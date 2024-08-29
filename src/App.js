import React, { useState, useEffect } from "react";
import Grid from "./components/Grid";
import IntroPopUp from "./components/IntroPopUp";
import RoleSelectionPopUp from "./components/RoleSelectionPopUp";
import GameOverPopUp from "./components/GameOverPopUp";
import ClueInput from "./components/ClueInput";
import ModelSelector from "./components/ModelSelector";
import GameMessage from "./components/GameMessage";
import Legend from "./components/Legend";
import { loadWords } from "./utils/loadWords";
import { fetchAPI } from "./utils/fetchAPI";
import { toTitleCase } from "./utils/toTitleCase";

const App = () => {
    const [words, setWords] = useState([]);
    const [showIntro, setShowIntro] = useState(true);
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [showClueInput, setShowClueInput] = useState(false);

    const [error, setError] = useState(null);

    const [model, setModel] = useState("gpt-4o");
    const [explanation, setExplanation] = useState("");

    const [numCodenamesClued, setNumCodenamesClued] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessQueue, setGuessQueue] = useState([]);
    const [isProcessingGuess, setIsProcessingGuess] = useState(false);

    const [currentTurn, setCurrentTurn] = useState("user"); // 'user' or 'computer'
    const [gameMessage, setGameMessage] = useState("");
    const [clickToAdvance, setClickToAdvance] = useState(false);

    const [confirmReset, setConfirmReset] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(""); // 'win' or 'lose'

    const [hoveredTeam, setHoveredTeam] = useState(null);
    const [selectedCards, setSelectedCards] = useState([]);

    const [turnData, setTurnData] = useState([]);

    const handleCardHover = (team) => {
        setHoveredTeam(team);
    };

    const handleCardHoverEnd = () => {
        setHoveredTeam(null);
    };

    const handleCardClick = (wordObj) => {
        if (
            currentTurn === "user" &&
            showClueInput &&
            wordObj.team === "user" &&
            !wordObj.isGuessed
        ) {
            setSelectedCards((prevSelected) => {
                if (prevSelected.includes(wordObj.word)) {
                    return prevSelected.filter((word) => word !== wordObj.word);
                } else {
                    return [...prevSelected, wordObj.word];
                }
            });
        }
    };

    useEffect(() => {
        setNumCodenamesClued(selectedCards.length);
    }, [selectedCards]);

    const fetchWords = async () => {
        const gameWords = await loadWords();
        setWords(gameWords);
    };

    // load words on first render
    useEffect(() => {
        fetchWords();
    }, []);

    // show game instructions pop up
    const startGame = () => {
        setShowIntro(false);
        setShowRoleSelection(true);
    };

    // show role selection pop up
    const selectRole = () => {
        setShowRoleSelection(false);
        setShowClueInput(true);
    };

    // handle user clue submission
    const handleClueSubmit = async (clue, number) => {
        console.log("User turn");
        console.log(clue, ",", number);

        // Update turnData with the user clue and intended guesses
        setTurnData((prevTurnData) => ({
            ...prevTurnData,
            spymaster: "human",
            clue: clue,
            number: number,
            cluedWords: selectedCards,
        }));

        setShowClueInput(false);
        setGameMessage(
            `Your clue is '${toTitleCase(
                clue
            )}', ${number}. Your GPTeammate is thinking...`
        );
        await getGuesses(clue, number);
    };

    // get guesses from GPT API
    const getGuesses = async (clue, number) => {
        try {
            const unguessedWordObjs = words.filter((word) => !word.isGuessed);
            const unguessedWords = unguessedWordObjs.map(
                (wordObj) => wordObj.word
            );
            const body = {
                clue,
                number,
                unguessedWords,
            };

            const data = await fetchAPI(
                `http://localhost:3001/gpt-field-operative?model=${model}&explanation=${
                    true ? 1 : 0
                }`,
                "POST",
                body
            );

            if (data.rateLimitError) {
                setShowClueInput(false);
                setGameMessage(
                    "Hourly API limit reached. Reset the game and try again soon!"
                );
                setClickToAdvance(false);
            } else {
                console.log(data.guesses);

                setGuessQueue(data.guesses);
                setIsProcessingGuess(true);
                setClickToAdvance(true);
            }
        } catch {
            setError(
                "Sorry, we're having trouble communicating with the GPT. Please restart the game"
            );
        }
    };

    useEffect(() => {
        const handleClick = (event) => {
            if (!event.target.closest(".action")) {
                // If there's a confirmation reset active and the click is outside the button, reset it
                if (confirmReset) {
                    setConfirmReset(false);
                } else if (guessQueue.length > 0 && isProcessingGuess) {
                    if (typeof guessQueue[0] === "object") {
                        setCurrentGuess(guessQueue[0].guess.toUpperCase());
                        setExplanation(guessQueue[0].explanation);
                        processGuess(guessQueue[0].guess);
                    } else {
                        setCurrentGuess(guessQueue[0].toUpperCase());
                        processGuess(guessQueue[0]);
                    }
                } else if (isProcessingGuess) {
                    endTurn();
                    setClickToAdvance(false);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [confirmReset, guessQueue, isProcessingGuess]);

    // process each guess in the guessQueue
    const processGuess = (guess) => {
        const wordIndex = words.findIndex(
            (word) => word.word === guess && !word.isGuessed
        );
        if (wordIndex !== -1) {
            if (words[wordIndex].team === "assassin") {
                setGameOver(true);
                setGameResult(currentTurn === "user" ? "lose" : "win");
                setGameMessage(
                    `Guess ${guess.toUpperCase()} was the assassin. Game over!`
                );
                setIsProcessingGuess(false);
                setTurnData((prevTurnData) => ({
                    ...prevTurnData,
                    incorrectGuess: guess,
                    assassin: true,
                }));
                endTurn();
            } else if (words[wordIndex].team !== currentTurn) {
                setWords((prevWords) =>
                    prevWords.map((word, idx) =>
                        idx === wordIndex ? { ...word, isGuessed: true } : word
                    )
                );
                setGameMessage(
                    `Guess ${guess.toUpperCase()} is ${
                        words[wordIndex].team !== "bystander"
                            ? "an enemy agent"
                            : "a bystander"
                    }. End of turn.`
                );
                setTurnData((prevTurnData) => ({
                    ...prevTurnData,
                    incorrectGuess: guess,
                }));
                setGuessQueue([]);
            } else {
                setWords((prevWords) =>
                    prevWords.map((word, idx) =>
                        idx === wordIndex ? { ...word, isGuessed: true } : word
                    )
                );
                setGameMessage(`Guess ${guess.toUpperCase()} is correct.`);
                setTurnData((prevTurnData) => ({
                    ...prevTurnData,
                    correctGuesses: [
                        ...(prevTurnData.correctGuesses || []),
                        guess,
                    ],
                }));
                setGuessQueue((prevQueue) => prevQueue.slice(1));
            }
        } else {
            endTurn();
            setClickToAdvance(true);
        }
    };

    // simulate GPT turn whenever turn changes
    useEffect(() => {
        if (currentTurn === "computer" && !gameOver) {
            simulateGPTTurn();
        }
    }, [currentTurn, gameOver]);

    // simulate GPT turn by getting clue and then getting guesses
    const simulateGPTTurn = async () => {
        setClickToAdvance(false);
        console.log("GPT turn");
        const [clue, number] = await getGPTClue();
        setTurnData((prevTurnData) => ({
            ...prevTurnData,
            spymaster: model,
            clue: clue,
            number: number,
            cluedWords: [], // Placeholder for GPT clued words
        }));
        console.log(clue, ",", number);
        setGameMessage(
            `The GPT spymaster's clue is '${toTitleCase(clue)}', ${number}.`
        );
        await getGuesses({ clue, number });
    };

    // get clue from GPT API
    const getGPTClue = async () => {
        setGameMessage("The GPT Spymaster is thinking...");
        setClickToAdvance(false);
        const team = words
            .filter((word) => word.team === "computer" && !word.isGuessed)
            .map((word) => word.word);
        const otherTeam = words
            .filter((word) => word.team === "user" && !word.isGuessed)
            .map((word) => word.word);
        const bystanders = words
            .filter((word) => word.team === "bystander" && !word.isGuessed)
            .map((word) => word.word);
        const assassin = words.find((word) => word.team === "assassin").word;

        if (
            !team.length ||
            !otherTeam.length ||
            !bystanders.length ||
            !assassin
        ) {
            console.error("Missing required words for making clue request");
            setError("Missing words for making clue request");
            return;
        }

        const body = {
            teamWords: team,
            otherTeamWords: otherTeam,
            bystanderWords: bystanders,
            assassinWord: assassin,
        };

        try {
            const data = await fetchAPI(
                `http://localhost:3001/gpt-spymaster?model=${model}`,
                "POST",
                body
            );

            if (data.rateLimitError) {
                setGameMessage(
                    "Hourly API limit reached. Reset the game and try again soon!"
                );
                setClickToAdvance(false);
            } else {
                const clue = data.clue;
                const number = Number(data.number);
                return [clue, number];
            }
        } catch (error) {
            console.error("Error in fetching GPT clue:", error);
            setError(
                "Sorry, we're having trouble communicating with the GPT. Please restart the game"
            );
        }
    };

    // end turn and switch to next turn
    const endTurn = () => {
        console.log("TURN DATA", turnData);

        // Placeholder for posting to a Firebase database
        // postTurnDataToFirebase(turnDataEntry);

        setIsProcessingGuess(false);
        setGuessQueue([]);
        setSelectedCards([]);
        setTurnData([]);

        const userWordsGuessed = words.filter(
            (word) => word.team === "user" && word.isGuessed
        ).length;
        const gptWordsGuessed = words.filter(
            (word) => word.team === "computer" && word.isGuessed
        ).length;
        const assassinGuessed = words.some(
            (word) => word.team === "assassin" && word.isGuessed
        );

        if (
            userWordsGuessed === 9 ||
            gptWordsGuessed === 8 ||
            assassinGuessed
        ) {
            setGameOver(true);
            setGameResult(
                userWordsGuessed === 9 ||
                    (assassinGuessed && currentTurn === "computer")
                    ? "win"
                    : "lose"
            );
        } else {
            if (currentTurn === "user") {
                setCurrentTurn("computer");
            } else {
                setGameMessage("");
                setShowClueInput(true);
                setCurrentTurn("user");
            }
        }
    };

    const handleResetClick = (event) => {
        event.stopPropagation();
        if (confirmReset) {
            resetGame();
        } else {
            setConfirmReset(true);
        }
    };

    // reset game when user clicks restart
    const resetGame = () => {
        fetchWords();
        // setShowRoleSelection(true);
        setGameOver(false);
        setGameResult("");
        setCurrentTurn("user");
        setShowClueInput(true);
        setGameMessage("");
        setError("");
        setClickToAdvance(false);
        setConfirmReset(false); // Reset the confirmation state
        setSelectedCards([]); // Clear selected cards
    };

    const currentGuessTeam = (currentGuess) => {
        const wordObj = words.find(
            (word) => word.word.toUpperCase() === currentGuess
        );
        return wordObj ? wordObj.team : null;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div
                className="relative grid-container flex justify-center items-center w-full"
                style={{ maxWidth: "45vw" }}
            >
                {words.length > 0 ? (
                    <Grid
                        words={words}
                        clueInput={showClueInput}
                        onCardHover={handleCardHover}
                        onCardHoverEnd={handleCardHoverEnd}
                        hoveredTeam={hoveredTeam}
                        onCardClick={handleCardClick}
                        selectedCards={selectedCards}
                    />
                ) : (
                    <p>Loading...</p>
                )}
                <div className="absolute right-0 bottom-0 transform translate-x-full -mr-4">
                    <Legend setHoveredTeam={setHoveredTeam} />
                </div>
            </div>
            <div className="interaction-box flex flex-col items-center justify-center w-full mt-8">
                <GameMessage
                    gameMessage={gameMessage}
                    currentGuess={currentGuess}
                    guessTeam={currentGuessTeam(currentGuess)}
                    explanation={explanation}
                />
                {showClueInput &&
                    currentTurn === "user" &&
                    !isProcessingGuess && (
                        <ClueInput
                            onSubmitClue={handleClueSubmit}
                            show={true}
                            words={words.map((word) => word.word.toUpperCase())}
                            numCodenamesClued={numCodenamesClued}
                        />
                    )}
                {clickToAdvance && (
                    <p className="text-lg h-8 text-gray-500 absolute bottom-16">
                        <i>{"Click to advance"}</i>
                    </p>
                )}
                {error && <div className="text-red-500">{error}</div>}
                {showIntro && <IntroPopUp onStart={startGame} />}
                {showRoleSelection && (
                    <RoleSelectionPopUp onSelectRole={selectRole} />
                )}
                {gameOver && (
                    <GameOverPopUp result={gameResult} onRestart={resetGame} />
                )}
            </div>
            <div className="absolute bottom-10 right-16 flex flex-col items-end space-y-4 ">
                {/* <ModelSelector model={model} setModel={setModel} /> */}
                <button
                    className={`rounded-lg px-4 py-2 ${
                        confirmReset
                            ? "bg-red-600 text-white"
                            : "bg-gray-600 text-white"
                    }`}
                    onClick={handleResetClick}
                >
                    {confirmReset ? "You sure?" : "Reset Game"}
                </button>
            </div>
        </div>
    );
};

export default App;
