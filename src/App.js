import React, { useState, useEffect } from "react";
import Grid from "./components/Grid";
import IntroPopUp from "./components/IntroPopUp";
import RoleSelectionPopUp from "./components/RoleSelectionPopUp";
import GameOverPopUp from "./components/GameOverPopUp";
import ClueInput from "./components/ClueInput";
import { loadWords } from "./utils/loadWords";
import { fetchAPI } from "./utils/fetchAPI";
import { toTitleCase } from "./utils/toTitleCase";

const App = () => {
    const DELAY = 2000;

    const [words, setWords] = useState([]);
    const [showIntro, setShowIntro] = useState(true);
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [showClueInput, setShowClueInput] = useState(false);
    const [error, setError] = useState(null);

    const [guessQueue, setGuessQueue] = useState([]);
    const [isProcessingGuess, setIsProcessingGuess] = useState(false);

    const [currentTurn, setCurrentTurn] = useState("user"); // 'user' or 'computer'
    const [gameMessage, setGameMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState(""); // 'win' or 'lose'

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
        setShowClueInput(false);
        setGameMessage(
            `Your clue is '${toTitleCase(clue)}', ${number}. The GPT is thinking...`
        );
        await getGuesses(clue, number);
    };

    // get guesses from GPT API
    const getGuesses = async (clue, number) => {
        const unguessedWordObjs = words.filter((word) => !word.isGuessed);
        const unguessedWords = unguessedWordObjs.map((wordObj) => wordObj.word);
        const body = {
            clue,
            number,
            unguessedWords,
        };

        const data = await fetchAPI(
            "http://localhost:3001/gpt-field-operative",
            "POST",
            body
        );
        console.log(data.guesses);

        setGuessQueue(data.guesses);
        setIsProcessingGuess(true);
    };

    // process guesses whenever guessQueue or isProcessingGuess changes
    useEffect(() => {
        if (guessQueue.length > 0 && isProcessingGuess) {
            const nextGuess = guessQueue[0];

            setTimeout(() => {
                processGuess(nextGuess);
            }, DELAY);
        } else if (isProcessingGuess) {
            setTimeout(() => {
                endTurn();
            }, DELAY);
        }
    }, [guessQueue, isProcessingGuess]);
    
    // process each guess in the guessQueue
    const processGuess = (guess) => {
        const wordIndex = words.findIndex(
            (word) => word.word === guess && !word.isGuessed
        );
        if (wordIndex !== -1) {
            if (words[wordIndex].team === "assassin") {
                setGameOver(true);
                setGameResult(currentTurn === "user" ? "lose" : "win");
                setGameMessage(`Guess '${guess}' was the assassin. Game over!`);
                setIsProcessingGuess(false);
            } else if (words[wordIndex].team !== currentTurn) {
                setWords((prevWords) =>
                    prevWords.map((word, idx) =>
                        idx === wordIndex ? { ...word, isGuessed: true } : word
                    )
                );
                setGameMessage(
                    `Guess '${guess}' is ${
                        words[wordIndex].team !== "bystander"
                            ? "an enemy agent"
                            : "a bystander"
                    }. End of turn.`
                );
                setGuessQueue([]);
            } else {
                setWords((prevWords) =>
                    prevWords.map((word, idx) =>
                        idx === wordIndex ? { ...word, isGuessed: true } : word
                    )
                );
                setGameMessage(`Guess ${guess.toUpperCase()} is correct.`);
                setGuessQueue((prevQueue) => prevQueue.slice(1));
            }
        } else {
            endTurn();
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
        console.log("GPT turn");
        const [clue, number] = await getGPTClue();
        console.log(clue, ",", number);
        setGameMessage(`The GPT spymaster's clue is '${toTitleCase(clue)}', ${number}.`);
        setTimeout(async () => {
            await getGuesses({ clue, number });
        }, DELAY);
    };

    // get clue from GPT API
    const getGPTClue = async () => {
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
                "http://localhost:3001/gpt-spymaster",
                "POST",
                body
            );

            const clue = data.clue;
            const number = Number(data.number);
            return [clue, number];
        } catch (error) {
            console.error("Error in fetching GPT clue:", error);
            setError(`Error fetching clue: ${error}`);
        }
    };


    // end turn and switch to next turn
    const endTurn = () => {
        setIsProcessingGuess(false);
        setGuessQueue([]);

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

    // reset game when user clicks restart
    const resetGame = () => {
        fetchWords();
        setShowRoleSelection(true);
        setGameOver(false);
        setGameResult("");
        setCurrentTurn("user");
        setShowClueInput(false);
        setGameMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div
                className="grid-container flex justify-center items-center w-full"
                style={{ maxWidth: "45vw" }}
            >
                {words.length > 0 ? <Grid words={words} /> : <p>Loading...</p>}
            </div>
            <div className="interaction-box flex flex-col items-center justify-center w-full mt-8">
                {error && <div className="text-red-500">{error}</div>}
                {gameMessage && <p className="text-lg h-8">{gameMessage}</p>}
                {showClueInput &&
                    currentTurn === "user" &&
                    !isProcessingGuess && (
                        <ClueInput
                            onSubmitClue={handleClueSubmit}
                            show={true}
                            words={words.map((word) => word.word.toUpperCase())}
                        />
                    )}
                {showIntro && <IntroPopUp onStart={startGame} />}
                {showRoleSelection && (
                    <RoleSelectionPopUp onSelectRole={selectRole} />
                )}
                {gameOver && (
                    <GameOverPopUp result={gameResult} onRestart={resetGame} />
                )}
            </div>
        </div>
    );
};

export default App;
