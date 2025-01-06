// services/api.js
import axios from 'axios';

class CodenamesApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = "CodenamesApiError";
        this.status = status;
        this.data = data;
    }
}

const DEFAULT_CONFIG = {
    baseUrl: "http://localhost:3001",
    maxRetries: 3,
    retryDelay: 1000,
};

// Core API functions - independent of state management
const api = {
    async getClue(
        teamWords,
        otherWords,
        bystanderWords,
        assassinWord,
        options = {}
    ) {
        const { model = "gpt-4o", baseUrl = DEFAULT_CONFIG.baseUrl } = options;

        const operation = async () => {
            try {
                const response = await axios.post(
                    `${baseUrl}/gpt-spymaster`,
                    {
                        teamWords,
                        otherTeamWords: otherWords,
                        bystanderWords,
                        assassinWord,
                    },
                    {
                        params: { model },
                    }
                );
                return response.data;
            } catch (error) {
                throw new CodenamesApiError(
                    error.response?.data?.error || "Failed to get clue",
                    error.response?.status || 500,
                    error.response?.data
                );
            }
        };

        return retryOperation(operation, DEFAULT_CONFIG.maxRetries);
    },

    async getGuesses(clue, number, unguessedWords, options = {}) {
        const {
            model = "gpt-4o",
            explanation = 0,
            baseUrl = DEFAULT_CONFIG.baseUrl,
        } = options;

        const url = `${baseUrl}/gpt-field-operative`;
        console.log("Making request to:", url);
        console.log("With payload:", {
            clue,
            number,
            unguessedWords,
            model,
            explanation,
        });

        try {
            const response = await axios.post(
                url,
                {
                    clue,
                    number,
                    unguessedWords,
                },
                {
                    params: { model, explanation },
                }
            );
            console.log("Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            throw new CodenamesApiError(
                error.response?.data?.error || "Failed to get guesses",
                error.response?.status || 500,
                error.response?.data
            );
        }
    },
};

// Utility functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryOperation(operation, maxRetries) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries) break;

            if (error.status === 429 || error.status >= 500) {
                await sleep(DEFAULT_CONFIG.retryDelay * attempt);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

// // Higher-level service that integrates with Zustand
// const gameService = {
//     async getClueFromState(store, options = {}) {
//         const state = store.getState();
//         const teamWords = state.getTeamWords("computer").map((w) => w.word);
//         const otherWords = state.getTeamWords("user").map((w) => w.word);
//         const bystanderWords = state
//             .getTeamWords("bystander")
//             .map((w) => w.word);
//         const assassinWord = state.getTeamWords("assassin")[0]?.word;

//         return api.getClue(
//             teamWords,
//             otherWords,
//             bystanderWords,
//             assassinWord,
//             options
//         );
//     },

//     async getGuessesFromState(store, options = {}) {
//         const state = store.getState();
//         const unguessedWords = state.getUnguessedWords().map((w) => w.word);

//         return api.getGuesses(clue, number, unguessedWords, options);
//     },
// };


export { api, CodenamesApiError };
