// stores/slices/clueSlice.js
import { gameService } from '../../services/api';
import { toTitleCase } from "../../utils/toTitleCase";

export const createClueSlice = (set, get) => ({
    // State
    showClueInput: true,
    currentClue: "",
    clueNumber: 0,
    isProcessingClue: false,
    selectedCards: [],
    error: null,
    
    // Form state
    formInput: "",
    hasSpace: false,
    isInvalidWord: false,
    
    // Actions
    setShowClueInput: (show) => set({ showClueInput: show }),
    
    setSelectedCards: (cards) => set({ selectedCards: cards }),
    
    // Form handling actions
    handleClueChange: (value) => {
        const { words } = get();
        set({ 
            formInput: value,
            hasSpace: /\s/.test(value),
            isInvalidWord: words.map(w => w.word).includes(value.toUpperCase())
        });
    },
    
    clearForm: () => set({
        formInput: "",
        hasSpace: false,
        isInvalidWord: false
    }),
    
    handleClueSubmit: async () => {
        const { formInput, selectedCards } = get();
        
        try {
            await get().submitClue(formInput, selectedCards.length);
            get().clearForm();
            return true;
        } catch (error) {
            set({ error: "Failed to submit clue" });
            return false;
        }
    },

    submitClue: async (clue, number, gameID) => {
        set({ 
            isProcessingClue: true,
            currentClue: clue,
            clueNumber: number,
            showClueInput: false 
        });

        try {
            const { setGameMessage, setTurnData } = get();
            
            setTurnData({
                spymaster: "human",
                clue: clue,
                number: number,
                cluedWords: get().selectedCards,
                gameID: gameID
            });

            setGameMessage(`Your clue is '${toTitleCase(clue)}', ${number}. Your GPTeammate is thinking...`);
            
            return true;
        } catch (error) {
            set({ 
                error: "Failed to submit clue",
                isProcessingClue: false 
            });
            return false;
        }
    },

    // GPT Turn
    setGPTClue: async () => {
        const { setGameMessage } = get();
        set({ isProcessingClue: true });
        setGameMessage("The GPT Spymaster is thinking...");
        
        try {
            const result = await gameService.getClueFromState(get);

            if (!result) {
                throw new Error("Failed to get clue from API");
            }

            const { clue, number, cluedWords } = result;

            set({
                currentClue: clue,
                clueNumber: Number(number),
                selectedCards: cluedWords,
                isProcessingClue: false
            });

            return {
                clue,
                number: Number(number),
                cluedWords
            };

        } catch (error) {
            // Handle specific error types
            if (error.code === 'QUOTA_EXCEEDED') {
                setGameMessage("API quota exceeded. Please check your OpenAI account.");
            } else if (error.status === 429) {
                setGameMessage("Rate limit reached. Please try again in a moment.");
            } else {
                setGameMessage("Failed to get GPT clue. Please try again.");
            }
            
            set({ 
                error: error.message || "Failed to get GPT clue",
                isProcessingClue: false 
            });
            return null;
        }
    },

    clearClueState: () => set({
        showClueInput: true,
        currentClue: "",
        clueNumber: 0,
        isProcessingClue: false,
        selectedCards: [],
        error: null,
        formInput: "",
        hasSpace: false,
        isInvalidWord: false
    }),

    // Selectors
    getCurrentClue: () => ({
        clue: get().currentClue,
        number: get().clueNumber,
        selectedCards: get().selectedCards,
        isProcessing: get().isProcessingClue
    }),
    
    getFormState: () => ({
        input: get().formInput,
        hasSpace: get().hasSpace,
        isInvalidWord: get().isInvalidWord
    })
});