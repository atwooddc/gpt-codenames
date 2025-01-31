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
            isInvalidWord: getWordStrings().includes(value.toLowerCase()),
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
            numberSelected,
            setGameMessage,
            fetchGuesses,
            clearClueForm,
        } = get();

        set({
            isProcessingClue: true,
            currentClue: input,
            clueNumber: numberSelected(),
            showClueInput: false,
        });

        try {
            setGameMessage(
                `Your clue is '${input}', ${numberSelected()}. Your GPTeammate is thinking...`
            );
            await new Promise((resolve) => setTimeout(resolve, 3000));

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
        const {
            getUnguessedTeamWordStrings,
            fetchGuesses,
            setGameMessage,
            setClickHandler,
        } = get();

        try {
            setGameMessage("GPT Spymaster is thinking...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // keep this

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

            setGameMessage(
                `The GPT spymaster's clue is '${response.clue}', ${response.number}`
            );

            await fetchGuesses();

            // setClickHandler('fetchGuesses', async () => {
            //     await get().fetchGuesses();
            // });

            return true;
        } catch (error) {
            set({ error: "Failed to generate clue" });
            return false;
        }
    },
});
