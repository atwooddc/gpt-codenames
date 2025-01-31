export const createGameStateSlice = (set, get) => ({
    currentTurn: "user",
    gameResult: null,
    gameID: null,
    model: "gpt-4",

    checkGameEnd: () => {
        const { words, currentTurn, setGameMessage } = get();

        // Check assassin
        const assassinGuessed = words.find(
            (word) => word.team === "assassin" && word.isGuessed
        );
        if (assassinGuessed) {
            const winner = currentTurn === "user" ? "computer" : "user";
            setGameMessage(
                `Game Over! The ${winner} team wins! (Assassin was guessed)`
            );
            set({ gameResult: winner });
            return true;
        }

        // Check team victories
        const unguessedByTeam = {
            user: words.filter((w) => w.team === "user" && !w.isGuessed),
            computer: words.filter(
                (w) => w.team === "computer" && !w.isGuessed
            ),
        };

        for (const [team, words] of Object.entries(unguessedByTeam)) {
            if (words.length === 0) {
                setGameMessage(`Game Over! The ${team} team wins!`);
                set({ gameResult: team });
                return true;
            }
        }

        return false;
    },

    toggleCurrentTurn: () =>
        set((state) => ({
            currentTurn: state.currentTurn === "user" ? "computer" : "user",
        })),

    endTurn: async () => {
        const {
            checkGameEnd,
            currentTurn,
            toggleCurrentTurn,
            generateGPTClue,
            setShowClueInput,
            setGameMessage,
        } = get();

        // Check for game end conditions
        if (checkGameEnd()) return;

        // Reset word selections
        set((state) => ({
            words: state.words.map((word) => ({
                ...word,
                isSelected: false,
            })),
        }));

        // Reset game message
        setGameMessage("");

        toggleCurrentTurn();

        if (currentTurn === "user") {
            await generateGPTClue();
        } else {
            setShowClueInput(true);
        }

        // Handle turn transition
    },
});
