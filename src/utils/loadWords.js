export const loadWords = async () => {
  const response = await fetch('/words.txt');
  const text = await response.text();
  const wordsArray = text.split(',');
  const shuffledWords = wordsArray.sort(() => 0.5 - Math.random());
  const selectedWords = shuffledWords.slice(0, 25);

  const gameWords = selectedWords.map((word, index) => {
    if (index < 9) return { "word": word, team: "user", isGuessed: false };
    if (index < 17) return { "word": word, team: "computer", isGuessed: false };
    if (index < 24) return { "word": word, team: "bystander", isGuessed: false };
    return { "word": word.toUpperCase(), team: "assassin", isGuessed: false };
  });

  return gameWords.sort(() => 0.5 - Math.random());
};
