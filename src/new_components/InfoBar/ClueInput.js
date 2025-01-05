import { React } from "react";
import useGameStore from "../../stores/gameStore";

const ClueInput = () => {
    const getSelectedWords = useGameStore((state) => state.getSelectedWords);
    const handleClueChange = useGameStore((state) => state.handleClueChange);
    const handleClueSubmit = useGameStore((state) => state.handleClueSubmit);
    
    const formInput = useGameStore((state) => state.formInput);
    const formHasSpace = useGameStore((state) => state.formHasSpace);
    const formIsInvalidWord = useGameStore((state) => state.formIsInvalidWord);

    const numCodenamesClued = getSelectedWords().length;

    return (
        <div className="flex items-center space-x-4 h-8 text-black">
            <input
                type="text"
                value={formInput}
                onChange={(e) => handleClueChange(e.target.value)}
                className="p-2 rounded"
                placeholder="One-word clue"
            />
            <button
                onClick={() => handleClueSubmit()}
                className="px-4 py-2 bg-purple text-white rounded disabled:opacity-50"
                disabled={
                    numCodenamesClued === 0 ||
                    formHasSpace ||
                    formInput.trim() === "" ||
                    formInput.length > 46 ||
                    formIsInvalidWord
                }
            >
                Submit
            </button>
        </div>
    );
};

export default ClueInput;