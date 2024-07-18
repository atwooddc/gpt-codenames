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
                    Acts as a guesser for the table game Codenames. 
                    Receives as input a stringified JSON object of the format 
                    {
                        clue,
                        number,
                        words
                    }
                    representing the clue 'clue' to 'number' of words in 'words'. 
                    Returns ONLY an array with a subset of the remaining words 
                    that relate most to the clue in the format ["Guess1","Guess2,...]
                    The guesses should be ordered from most to least confident.
                    The most important thing is that the words that you return are in the 'words' array. 
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

        const guesses = JSON.parse(response.choices[0].message.content).map(
            (guess) => guess.trim()
        );

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

        const inputJson = {
            teamWords,
            otherTeamWords,
            bystanderWords,
            assassinWord,
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
                    Acts as spymaster (clue generator) for the table game Codenames. 
                    Receives as input a stringified JSON object of the format 
                    {team,otherTeam,bystanders,assassin} representing 
                    the remaining words on its own team (team), remaining 
                    words on the other team (otherTeam), bystander words, and the assassin. 
                    The spymaster provides a one-word clue to any number of their team's words. 
                    When selecting a one-word clue, the spymaster considers the association 
                    to its own team's words (positive), the association to the bystander words 
                    (negative), the association to the other team's words (very negative), 
                    and the association to the assassin word (to be avoided at all costs). 
                    Prioritize clarity and risk aversion over giving multi-word clues.

                    Returns ONLY an array with the clue followed by a string containing an integer
                    representing the number of words clued: ["clue", "number"], ex. ["water", "1"]
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
