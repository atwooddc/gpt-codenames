import React from "react";
import clsx from "clsx";

import { useWords } from "../../../context/WordsContext";

const Card = ({ word }) => {
    const { toggleSelected } = useWords();

    return (
        <div
            onClick={() => toggleSelected(word)}
            className={clsx(
                "rounded-sm font-courier flex justify-center items-center h-10 cursor-pointer",
                {
                    "bg-user": word.team === "user",
                    "bg-computer": word.team === "computer",
                    "bg-bystander": word.team === "bystander",
                    "bg-assassin": word.team === "assassin",
                    "font-bold text-sm": word.isSelected,
                    "text-xs": !word.isSelected,
                    outline: word.isSelected,
                }
            )}
        >
            {word.word}
        </div>
    );
};

export default Card;
