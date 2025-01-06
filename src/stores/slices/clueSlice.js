import { api } from "../../services/api";

export const createClueSlice = (set, get) => ({
    // State
    currentClue: "",
    clueNumber: 0,
    cluedWords: [],
    showClueInput: true,
    isProcessingClue: false,

    // Form state
    input: "",
    hasSpace: false,
    isInvalidWord: false,

    // Actions
    setShowClueInput: (show) => set({ showClueInput: show }),

    handleClueChange: (value) => {
        const { getWordStrings } = get();
        set({
            input: value,
            hasSpace: /\s/.test(value),
            isInvalidWord: getWordStrings().includes(value.toUpperCase()),
        });
    },

    clearClueForm: () =>
        set({
            input: "",
            hasSpace: false,
            isInvalidWord: false,
        }),

    handleClueSubmit: async () => {
        const {
            input,
            getSelectedWords,
            setGameMessage,
            fetchGuesses,
            clearClueForm,
        } = get();

        if (!input || input.trim() === "") return false;

        set({
            isProcessingClue: true,
            currentClue: input,
            clueNumber: getSelectedWords().length,
            showClueInput: false,
        });

        try {
            setGameMessage("Waiting for guesses...");
            await fetchGuesses();
            clearClueForm();
            return true;
        } catch (error) {
            set({
                error: "Failed to submit clue",
                isProcessingClue: false,
                showClueInput: true,
            });
            return false;
        }
    },

    generateGPTClue: async () => {
        const { getUnguessedTeamWordStrings, fetchGuesses, setGameMessage } =
            get();

        try {
            setGameMessage("GPT Spymaster is thinking...");

            const response = await api.getClue({
                computerWords: getUnguessedTeamWordStrings("computer"),
                userWords: getUnguessedTeamWordStrings("user"),
                bystanderWords: getUnguessedTeamWordStrings("bystander"),
                assassinWord: getUnguessedTeamWordStrings("assassin")[0],
            });

            if (!response?.clue || !response?.number) {
                throw new Error("Invalid clue response format");
            }

            set({
                currentClue: response.clue,
                clueNumber: response.number,
                cluedWords: response.cluedWords || [],
                showClueInput: false,
            });

            await fetchGuesses();
            return true;
        } catch (error) {
            set({ error: "Failed to generate clue" });
            return false;
        }
    },
});
