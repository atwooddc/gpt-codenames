// Word.js
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useWords } from "../../../context/WordsContext";

const Word = ({
    word,
    constraintsRef,
    initialPosition,
    position,
    onDragEnd,
    onMeasure,
}) => {
    const { toggleSelected } = useWords();
    const isDragging = useRef(false);
    const wordRef = useRef(null);

    useEffect(() => {
        const measureWord = () => {
            if (wordRef.current) {
                const rect = wordRef.current.getBoundingClientRect();
                console.log("Measuring word:", {
                    word: word.word,
                    width: rect.width,
                    height: rect.height,
                });
                onMeasure({
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        // Measure after a short delay to ensure rendering is complete
        const timeoutId = setTimeout(measureWord, 0);

        return () => clearTimeout(timeoutId);
    }, [word.word]);

    if (!initialPosition?.x || !initialPosition?.y) {
        return null;
    }

    const x = position ? position.x : 0;
    const y = position ? position.y : 0;

    const handleDragStart = () => {
        isDragging.current = true;
    };

    const handleClick = () => {
        if (!isDragging.current) {
            toggleSelected(word);
        }
    };

    return (
        <motion.div
            ref={wordRef}
            onClick={handleClick}
            onDragStart={handleDragStart}
            layout
            layoutId={word.word}
            drag
            dragMomentum={false}
            dragConstraints={constraintsRef}
            dragElastic={0.5}
            dragTransition={{
                power: 0.2,
            }}
            whileTap={{ scale: 1.5 }}
            style={{
                position: "absolute",
                left: `${initialPosition.x}px`,
                top: `${initialPosition.y}px`,
                transformOrigin: "center",
                display: "inline-block", // Added to ensure proper measurement
                whiteSpace: "nowrap", // Added to keep word on one line
            }}
            animate={{
                x,
                y,
                transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    layout: { duration: 0.3 },
                },
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
            }}
            onDragEnd={(_, info) => {
                const proposedPosition = {
                    x: x + info.offset.x,
                    y: y + info.offset.y,
                };
                onDragEnd(proposedPosition);
                setTimeout(() => {
                    isDragging.current = false;
                }, 0);
            }}
            className={clsx(
                "cursor-grab origin-center text-xs sm:text-sm md:text-md rounded-sm px-1",
                {
                    "outline origin-center": word.isSelected,
                    "text-xs sm:text-sm md:text-md": !word.isSelected,
                }
            )}
        >
            {word.word}
        </motion.div>
    );
};

export default Word;
