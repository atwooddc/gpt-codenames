export const createGameMessageSlice = (set, get) => ({
    // State
    gameMessage: "",

    // Actions
    setGameMessage: (message) => set({ gameMessage: message }),
});