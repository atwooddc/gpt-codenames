const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const app = express();
const port = 3001;

const apiLimiter = rateLimit({
    windowMs: 6 * 60 * 60 * 1000, // 6 hours
    max: 200, // requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});

app.use(cors());
app.use(express.json());
app.use(apiLimiter);

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
            console.warn(
                "JSON parse failed, attempting to fix:",
                jsonParseError
            );

            const fixedContent = rawContent.replace(
                /([{,]\s*)(\w+)(\s*:)/g,
                '$1"$2"$3'
            );
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
            Input: Receives a JSON object {teamWords, otherTeamWords, bystanderWords, assassinWord} with words from different categories.
            Task: Generate a one-word clue targeting the maximum possible words from 'teamWords' while avoiding any association with 'otherTeamWords', 'bystanderWords', and especially 'assassinWord'. The clue may not be a form of any of the words provided. 
            Output: Return ONLY an array with the clue, the number of target words, and an array of words from 'teamWords' that the clue relates to. Example: ["water", "2", ["ocean", "river"]]. Ensure the array of related words is exactly of length 'number', and again, return ONLY the array.
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

        const [clue, number, cluedWords] = JSON.parse(
            response.choices[0].message.content
        );

        // Ensure relatedWords is an array and has the correct length
        if (
            !Array.isArray(cluedWords) ||
            cluedWords.length !== Number(number)
        ) {
            res.status(500).json({
                error: "Invalid response format from OpenAI: clued words are invalid",
            });
            return;
        }

        res.json({ clue, number, cluedWords });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Error communicating with OpenAI" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
