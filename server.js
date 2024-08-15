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

        const explanation = req.query.explanation || 0;

        const inputJson = {
            clue,
            number,
            unguessedWords,
        };

        let systemContent = `
                    Role: Codenames guesser.
                    Input: stringified JSON {clue, number, unguessedWords}.
                    Output: ONLY an array of length 'number' containing most relevant words from 'unguessedWords' array, ["Guess1", "Guess2", ...], sorted by confidence.
                    Ensure selected words are from 'words'. Return nothing else besides the array.
                    `;

        if (explanation != 0) {
            systemContent = `
                Role: Codenames guesser.
                Input: stringified JSON {clue, number, unguessedWords}.
                Output: ONLY an array of length 'number' containing most relevant words from 'unguessedWords' array, each with a one-sentence explanation of how they relate to 'clue' [{ "guess": "Guess1", "explanation": "Explanation1" }, { "guess": "Guess2", "explanation": "Explanation2" }, ...], sorted by confidence.
                Ensure all JSON keys are enclosed in double quotes and selected words are from 'words'. Return nothing else besides the array.
                `;
        }

        console.log(systemContent);

        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: systemContent,
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

        try {
            guesses = JSON.parse(rawContent);
        } catch (jsonParseError) {
            console.warn("JSON parse failed, attempting to fix:", jsonParseError);

            const fixedContent = rawContent.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
            guesses = JSON.parse(fixedContent);
        }

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

        let systemContent = `
                    Role: Acts as the spymaster for Codenames, generating clues.
                    Input: Receives a JSON object {teamWords, otherTeamWords, bystanders, assassin} with words from different categories.
                    Task: Generate a one-word clue targeting the maximum possible words from 'teamWords' while avoiding any association with 'otherTeamWords', 'bystanderWords', and especially 'assassin'. The clue may not be a form of any of the words provided. 
                    Output: Returns ONLY an array with the clue and the number of target words: ["clue", "number"]. Example: ["water", "1"]. Again, ONLY return an array.
                    `;

        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: systemContent,
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
