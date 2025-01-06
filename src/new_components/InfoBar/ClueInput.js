import { React } from "react";
import useGameStore from "../../stores/gameStore";

const ClueInput = () => {
    const handleClueChange = useGameStore((state) => state.handleClueChange);
    const handleClueSubmit = useGameStore((state) => state.handleClueSubmit);

    const input = useGameStore((state) => state.input);
    const hasSpace = useGameStore((state) => state.hasSpace);
    const isInvalidWord = useGameStore((state) => state.isInvalidWord);

    const selectedWords = useGameStore((state) => state.selectedWords);
    const numCodenamesClued = selectedWords.length;

    return (
        <div className="flex items-center space-x-4 h-8 text-black">
            <input
                type="text"
                value={input}
                onChange={(e) => handleClueChange(e.target.value)}
                className="p-2 rounded"
                placeholder="One-word clue"
            />
            <button
                onClick={() => handleClueSubmit()}
                className="px-4 py-2 bg-purple text-white rounded disabled:opacity-50"
                disabled={
                    numCodenamesClued === 0 ||
                    hasSpace ||
                    input.trim() === "" ||
                    input.length > 46 ||
                    isInvalidWord
                }
            >
                Submit
            </button>
        </div>
    );
};

export default ClueInput;
