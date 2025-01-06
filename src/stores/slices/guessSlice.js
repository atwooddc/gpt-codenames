import { api } from "../../services/api";

export const createGuessSlice = (set, get) => ({
    guessQueue: [],
    isProcessingGuess: false,

    fetchGuesses: async () => {
        const { currentClue, clueNumber, getUnguessedWordStrings } = get();

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
            await get().processGuesses();
            return true;
        } catch (error) {
            set({ error: "Failed to fetch guesses" });
            return false;
        }
    },

    processGuesses: async () => {
        const { currentTurn, words, setGameMessage, endTurn } = get();
        set({ isProcessingGuess: true });

        const processNextGuess = async () => {
            const { guessQueue } = get();
            
            if (guessQueue.length === 0) {
                set({ isProcessingGuess: false });
                endTurn();
                return;
            }

            const [currentGuess, ...remainingGuesses] = guessQueue;
            const guessedWord = words.find(word => word.word === currentGuess);

            if (!guessedWord) {
                console.error("Invalid guess:", currentGuess);
                set({ guessQueue: remainingGuesses });
                processNextGuess();
                return;
            }

            // Update word state
            set(state => ({
                words: state.words.map(word =>
                    word.word === currentGuess
                        ? { ...word, isSelected: false, isGuessed: true }
                        : word
                )
            }));

            setGameMessage(`${currentGuess} was guessed`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if guess was incorrect
            if (guessedWord.team !== currentTurn) {
                setGameMessage(`${currentGuess} belongs to the other team! Turn ends.`);
                set({ guessQueue: [] });
                endTurn();
                return;
            }

            set({ guessQueue: remainingGuesses });
            processNextGuess();
        };

        await processNextGuess();
    }
});