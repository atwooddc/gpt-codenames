export async function uploadTurnData(turnData) {
    const turnDataSchema = {
        gameID: "",
        spymaster: "",
        clue: "",
        number: 0,
        cluedWords: [],
        correctGuesses: [],
        incorrectGuess: null,
        assassin: false,
    };

    const dataToUpload = { ...turnDataSchema, ...turnData };

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const cloudFunctionUrl = process.env.REACT_APP_CLOUD_FUNCTION_URL;

    try {
        const response = await fetch(cloudFunctionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-secret-key": secretKey,
            },
            body: JSON.stringify(dataToUpload),
        });

        if (!response.ok) {
            const respText = await response.text();
            throw new Error(`Error uploading turn data: ${respText}`);
        }

        console.log("Turn data successfully uploaded!");
    } catch (error) {
        console.error("Error uploading turn data:", error);
        throw new Error("Error uploading turn data");
    }
}
