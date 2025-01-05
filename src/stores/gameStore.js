import { create } from "zustand";
import { createWordsSlice } from "./slices/wordsSlice";
import { createClueSlice } from "./slices/clueSlice";
// Import other slices as you create them

const useGameStore = create((set, get) => ({
    ...createWordsSlice(set, get),
    ...createClueSlice(set, get),
    // Add other slices as you create them
    // ...createGameStateSlice(set, get),
}));

export default useGameStore;
