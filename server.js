const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gpt-field-operative", async (req, res) => {
    try {
        // console.log(req.body.model);

        const { clue, number, unguessedWords } = req.body;
        const model = req.query.model || "gpt-4o";

        const inputJson = {
            clue,
            number,
            unguessedWords,
        };

        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: `
                    Role: Codenames guesser.
                    Input: stringified JSON {clue, number, unguessedWords}.
                    Output: ONLY an array of length 'number' containing most relevant words from 'unguessedWords' array, ["Guess1", "Guess2", ...], sorted by confidence.
                    Ensure selected words are from 'words'. Return nothing else besides the array.
                    `,
                },
                {
                    role: "user",
                    content: JSON.stringify(inputJson),
                },
            ],
        });

        if (!response.choices || !response.choices[0].message.content) {
            res.status(500).json({ error: "Invalid response from OpenAI" });
            return;
        }

        const rawContent = response.choices[0].message.content;
        // console.log("Raw Content:", rawContent);

        const guesses = JSON.parse(rawContent).map((guess) => guess.trim());

        res.json({ guesses });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

app.post("/gpt-field-operative/explanation", async (req, res) => {
    try {
        const { clue, number, unguessedWords } = req.body;

        const inputJson = {
            clue,
            number,
            unguessedWords,
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
                    Role: Codenames guesser.
                    Input: stringified JSON {clue, number, unguessedWords}.
                    ONLY an array of length 'number' containing {"word": "explanation"} pairs, ordered by relevance to the clue. 
                    Ensure selected words are from 'words'. Return nothing else besides the array.
                    `,
                },
                {
                    role: "user",
                    content: JSON.stringify(inputJson),
                },
            ],
        });

        if (!response.choices || !response.choices[0].message.content) {
            res.status(500).json({ error: "Invalid response from OpenAI" });
            return;
        }

        const rawContent = response.choices[0].message.content;
        console.log("Raw Content:", rawContent);

        const guesses = JSON.parse(rawContent).map((guess) => guess.trim());

        res.json({ guesses });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

app.post("/gpt-spymaster", async (req, res) => {
    try {
        const { teamWords, otherTeamWords, bystanderWords, assassinWord } =
            req.body;

        const model = req.query.model || "gpt-4o";

        const inputJson = {
            teamWords,
            otherTeamWords,
            bystanderWords,
            assassinWord,
        };

        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: `
                    Role: Acts as the spymaster for Codenames, generating clues.
                    Input: Receives a JSON object {teamWords, otherTeamWords, bystanders, assassin} with words from different categories.
                    Task: Generate a one-word clue targeting the maximum possible words from 'teamWords' while avoiding any association with 'otherTeamWords', 'bystanderWords', and especially 'assassin'.
                    Output: Returns ONLY an array with the clue and the number of target words: ["clue", "number"]. Example: ["water", "1"]. Again, ONLY return an array.
                    `,
                },
                {
                    role: "user",
                    content: JSON.stringify(inputJson),
                },
            ],
        });

        if (!response.choices || !response.choices[0].message.content) {
            res.status(500).json({ error: "Invalid response from OpenAI" });
            return;
        }

        const [clue, number] = JSON.parse(response.choices[0].message.content);

        res.json({ clue, number });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
