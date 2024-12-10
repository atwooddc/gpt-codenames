export const loadWords = async () => {
    const response = await fetch("/words.txt");
    const text = (await response.text()).toLowerCase();
    const wordsArray = text.split(",");
    const shuffledWords = wordsArray.sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, 24);

    const gameWords = selectedWords.map((word, index) => {
        if (index < 9)
            return {
                word: word,
                team: "user",
                isGuessed: false,
                isSelected: false,
            };
        if (index < 17)
            return {
                word: word,
                team: "computer",
                isGuessed: false,
                isSelected: false,
            };
        if (index < 23)
            return {
                word: word,
                team: "bystander",
                isGuessed: false,
                isSelected: false,
            };
        return {
            word: word,
            team: "assassin",
            isGuessed: false,
            isSelected: false,
        };
    });

    return gameWords.sort(() => 0.5 - Math.random());
};
