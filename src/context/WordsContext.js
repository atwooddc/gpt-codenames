import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { loadWords } from "../utils/loadWords";

// Create the context
const WordsContext = createContext();

// Hook to use the context
export const useWords = () => useContext(WordsContext);

// Provider component
export const WordsProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [shuffleOrder, setShuffleOrder] = useState([]);
    const [clusterPositions, setClusterPositions] = useState({
        user: [],
        computer: [],
        bystander: [],
        assassin: [],
    });

    // Fetch words when the component mounts
    useEffect(() => {
        const fetchWords = async () => {
            const gameWords = await loadWords();
            setWords(gameWords);
            setIsLoading(false);
        };

        fetchWords();
    }, []);

    // Initialize/update shuffle order when words array changes
    useEffect(() => {
        setShuffleOrder(Array.from({ length: words.length }, (_, i) => i));
    }, [words.length]);

    // Function to toggle the "selected" property
    const toggleSelected = (selectedWord) => {
        setWords((prevWords) =>
            prevWords.map((wordObj) =>
                wordObj.word === selectedWord.word && wordObj.team === "user"
                    ? { ...wordObj, isSelected: !wordObj.isSelected }
                    : wordObj
            )
        );
    };

    // Function to handle shuffling
    const handleShuffle = useCallback(() => {
        setShuffleOrder((prevOrder) => {
            const newOrder = [...prevOrder];
            for (let i = newOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
            }
            return newOrder;
        });
    }, []);

    const updateClusterPositions = useCallback((team, positions) => {
        setClusterPositions((prev) => ({
            ...prev,
            [team]: positions,
        }));
    }, []);

    const outOfPosition = useMemo(() => {
        return Object.values(clusterPositions).some(
            (positions) =>
                Array.isArray(positions) &&
                positions.some((pos) => pos !== null)
        );
    }, [clusterPositions]);

    return (
        <WordsContext.Provider
            value={{
                words,
                setWords,
                toggleSelected,
                isLoading,
                shuffleOrder,
                handleShuffle,
                clusterPositions,
                updateClusterPositions,
                outOfPosition,
            }}
        >
            {children}
        </WordsContext.Provider>
    );
};
