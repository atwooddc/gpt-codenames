// stores/slices/wordsSlice.js
import { loadWords } from "../../utils/loadWords";

export const createWordsSlice = (set, get) => ({
    words: [],
    isLoading: true,
    shuffleOrder: [],
    clusterPositions: {
        user: [],
        computer: [],
        bystander: [],
        assassin: [],
    },
    selectedWords: [],

    initializeWords: async (isReset = false) => {
        // If it's not a reset and we're already initialized, do nothing
        if (!isReset && get().words.length > 0) return;

        console.log("initializeWords");

        try {
            set({ isLoading: true });
            const gameWords = await loadWords();
            set({
                words: gameWords,
                selectedWords: [], // Reset selected words
                isLoading: false,
                shuffleOrder: Array.from(
                    { length: gameWords.length },
                    (_, i) => i
                ),
                // Reset other game-related state
                clusterPositions: {
                    user: [],
                    computer: [],
                    bystander: [],
                    assassin: [],
                },
                outOfPosition: false,
            });
        } catch (error) {
            console.error("Failed to initialize words:", error);
            set({ isLoading: false });
        }
    },

    // Word operations
    toggleSelected: (selectedWord) =>
        set((state) => {
            const newWords = state.words.map((wordObj) =>
                wordObj.word === selectedWord.word && wordObj.team === "user"
                    ? { ...wordObj, isSelected: !wordObj.isSelected }
                    : wordObj
            );

            // Update selectedWords at the same time
            const newSelectedWords = newWords.filter((w) => w.isSelected);

            return {
                words: newWords,
                selectedWords: newSelectedWords,
            };
        }),

    // Shuffle operations
    handleShuffle: () =>
        set((state) => ({
            shuffleOrder: state.shuffleOrder
                .slice()
                .sort(() => Math.random() - 0.5),
        })),

    // Selectors (can be accessed by other slices)
    getSelectedWords: () => get().selectedWords,
    getUnguessedWords: () => get().words.filter((w) => !w.isGuessed),
    getTeamWords: (team) => get().words.filter((w) => w.team === team),
    getUnguessedTeamWordStrings: (team) =>
        get()
            .words.filter((w) => w.team === team && !w.isGuessed)
            .map((w) => w.word),
    getWordStrings: () => get().words.map((w) => w.word),
    getUnguessedWordStrings: () =>
        get()
            .words.filter((w) => !w.isGuessed)
            .map((w) => w.word),

    outOfPosition: false,

    updateOutOfPosition: () => {
        const { clusterPositions } = get();
        const isOut = Object.values(clusterPositions).some(
            (positions) =>
                Array.isArray(positions) &&
                positions.some((pos) => pos !== null)
        );
        set({ outOfPosition: isOut });
    },

    updateClusterPositions: (team, positions) =>
        set((state) => {
            const newClusterPositions = {
                ...state.clusterPositions,
                [team]: positions,
            };

            const isOut = Object.values(newClusterPositions).some(
                (positions) =>
                    Array.isArray(positions) &&
                    positions.some((pos) => pos !== null)
            );

            return {
                clusterPositions: newClusterPositions,
                outOfPosition: isOut,
            };
        }),
});
