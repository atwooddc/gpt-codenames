import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import useGameStore from "../../../stores/gameStore";

const Card = ({ word }) => {
    const toggleSelected = useGameStore((state) => state.toggleSelected);
    const showClueInput = useGameStore((state) => state.showClueInput);

    const handleCardTap = () => {
        if (showClueInput && word.team === "user" && !word.isGuessed) {
            toggleSelected(word);
        }
    };

    const getBackgroundColor = (word) => {
        if (word.isGuessed) {
            switch (word.team) {
                case "user":
                    return "bg-dark-user";
                case "computer":
                    return "bg-dark-computer";
                case "bystander":
                    return "bg-dark-bystander";
                case "assassin":
                    return "bg-assassin";
                default:
                    return "bg-background";
            }
        }
        switch (word.team) {
            case "user":
                return "bg-user";
            case "computer":
                return "bg-computer";
            case "bystander":
                return "bg-bystander";
            case "assassin":
                return "bg-assassin";
            default:
                return "bg-background";
        }
    };

    return (
        <motion.div
            onTapStart={handleCardTap}
            className={clsx(
                "h-full w-full rounded-sm font-courier flex justify-center items-center cursor-pointer select-none",
                getBackgroundColor(word),
                {
                    "text-sm font-bold outline":
                        word.isSelected || window?.motionHovered,
                    "text-xs": !word.isSelected && !window?.motionHovered,
                }
            )}
            initial={{ scale: 1 }}
            whileTap={
                (word.team === "user" && word.isSelected) ||
                word.team !== "user"
                    ? {
                          scale: 1.1,
                          transition: { duration: 0.1 },
                      }
                    : {}
            }
            animate={{
                scale: 1,
                transition: { duration: 0.2 },
            }}
        >
            {!word.isGuessed && word.word}
        </motion.div>
    );
};

export default Card;
