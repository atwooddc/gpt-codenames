import { api } from "../../services/api";

export const createGuessSlice = (set, get) => ({
    guessQueue: [],
    isProcessingGuess: false,

    fetchGuesses: async () => {
        const {
            currentClue,
            clueNumber,
            getUnguessedWordStrings,
            setClickHandler,
        } = get();

        try {
            const response = await api.getGuesses(
                currentClue,
                clueNumber,
                getUnguessedWordStrings()
            );

            if (!response?.guesses?.length) {
                throw new Error("Invalid guesses response");
            }

            set({ guessQueue: response.guesses });

            setClickHandler("processGuesses", async () => {
                await get().processGuesses();
            });

            return true;
        } catch (error) {
            set({ error: "Failed to fetch guesses" });
            return false;
        }
    },

    processGuesses: async () => {
        const { setGameMessage, endTurn, setClickHandler } = get();
        set({ isProcessingGuess: true });

        const processNextGuess = async () => {
            const { guessQueue, words, currentTurn } = get();
            console.log("Processing next guess. Current queue:", guessQueue);

            if (guessQueue.length === 0) {
                console.log("Guess queue is empty. Ending turn.");
                set({ isProcessingGuess: false });
                endTurn();
                return;
            }

            const [currentGuess, ...remainingGuesses] = guessQueue;
            console.log("Current guess:", currentGuess);

            const guessedWord = words.find(
                (word) => word.word === currentGuess
            );

            if (!guessedWord) {
                console.error(
                    "Invalid guess:",
                    currentGuess,
                    "Not found in words list."
                );
                set({ guessQueue: remainingGuesses });
                processNextGuess();
                return;
            }

            console.log(`Guessed word found:`, guessedWord);

            setGameMessage(`${currentGuess} was guessed`);

            setClickHandler("updateWords", async () => {
                return;
            });

            set((state) => ({
                words: state.words.map((word) =>
                    word.word === currentGuess
                        ? { ...word, isSelected: false, isGuessed: true }
                        : word
                ),
            }));

            console.log(
                `Updated words list. ${currentGuess} marked as guessed.`
            );

            // Check if guess was incorrect
            if (guessedWord.team !== currentTurn) {
                console.log(
                    `${currentGuess} belongs to the other team! Ending turn.`
                );
                console.log(guessedWord.team, currentTurn);
                setGameMessage(
                    `${currentGuess} belongs to the other team! Turn over.`
                );
                set({ guessQueue: [] });
                endTurn();
                return;
            }

            console.log(
                `${currentGuess} was correct! Continuing with next guess.`
            );
            set({ guessQueue: remainingGuesses });
            setClickHandler("processGuesses", async () => {
                await processNextGuess();
            });
        };

        await processNextGuess();
    },
});
