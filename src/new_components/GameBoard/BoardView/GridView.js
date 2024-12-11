import React from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import { useWords } from "../../../context/WordsContext";

const GridView = () => {
    const { words, shuffleOrder } = useWords();

    return (
        <div
            className={
                "w-full h-full non-mobile:justify-self-center grid grid-cols-4 auto-rows-fr gap-3 sm:gap-3 md:gap-4 lg:gap-5"
            }
        >
            {shuffleOrder.map((index) => (
                <motion.div
                    key={words[index].word}
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        duration: 0.3
                    }}
                >
                    <Card word={words[index]} />
                </motion.div>
            ))}
        </div>
    );
};

export default GridView;
