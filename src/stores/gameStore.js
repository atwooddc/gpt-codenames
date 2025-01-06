import { create } from "zustand";
import { createClickHandlerSlice } from "./slices/clickHandlerSlice";
import { createClueSlice } from "./slices/clueSlice";
import { createGameMessageSlice } from "./slices/gameMessageSlice";
import { createGameStateSlice } from "./slices/gameStateSlice";
import { createGuessSlice } from "./slices/guessSlice";
import { createWordsSlice } from "./slices/wordsSlice";

const useGameStore = create((set, get) => ({
    ...createClueSlice(set, get),
    ...createGameMessageSlice(set, get),
    ...createGameStateSlice(set, get),
    ...createGuessSlice(set, get),
    ...createWordsSlice(set, get),
    ...createClickHandlerSlice(set, get),
}));

export default useGameStore;
