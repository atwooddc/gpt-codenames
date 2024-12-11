import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import { useWords } from "../../../context/WordsContext";

const Card = ({ word }) => {
    const { toggleSelected } = useWords();

    return (
        <motion.div
            onClick={() => toggleSelected(word)}
            className={clsx(
                "h-full w-full rounded-sm font-courier flex justify-center items-center cursor-pointer select-none",
                {
                    "bg-user": word.team === "user",
                    "bg-computer": word.team === "computer",
                    "bg-bystander": word.team === "bystander",
                    "bg-assassin": word.team === "assassin",
                    "text-sm font-bold": word.isSelected,
                    "text-xs": !word.isSelected,
                    outline: word.isSelected,
                }
            )}
            whileTap={{
                scale: 1.1,
                transition: { duration: 0.1 },
            }}
            animate={{
                scale: 1,
                transition: { duration: 0.2 },
            }}
        >
            {word.word}
        </motion.div>
    );
};

export default Card;
