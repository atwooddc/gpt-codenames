import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import { useWords } from "../../../context/WordsContext";
import { RESET_ALL_CLUSTERS } from "../../../services/resetPositionsEvent";

import Word from "./Word";

const Cluster = ({ team }) => {
    const { words, shuffleOrder, clusterPositions, updateClusterPositions } =
        useWords();

    const clusterRef = useRef(null);
    const constraintsRef = useRef(null);

    const positions = clusterPositions[team] || [];
    const [initialPositions, setInitialPositions] = useState([]);
    const [wordDimensions, setWordDimensions] = useState([]);
    const [wordHeight, setWordHeight] = useState(0);

    const unguessedWords = useMemo(() => {
        const teamShuffleOrder = shuffleOrder
            .map((index) => words[index])
            .filter((word) => !word.isGuessed && word.team === team);

        return teamShuffleOrder;
    }, [words, team, shuffleOrder]);

    useEffect(() => {
        if (unguessedWords.length > 0) {
            updateClusterPositions(
                team,
                Array(unguessedWords.length).fill(null)
            );
        }
    }, [unguessedWords.length, team, updateClusterPositions]);

    useEffect(() => {
        setWordDimensions(
            new Array(unguessedWords.length).fill({ width: 0, height: 0 })
        );
    }, [unguessedWords.length]);

    const handleWordMeasure = useCallback((index, dimensions) => {
        setWordDimensions((prev) => {
            const newDimensions = [...prev];
            newDimensions[index] = dimensions;
            return newDimensions;
        });
    }, []);

    useEffect(() => {
        document.addEventListener(RESET_ALL_CLUSTERS, handleReset);

        return () => {
            document.removeEventListener(RESET_ALL_CLUSTERS, handleReset);
        };
    }, []);

    const handleReset = () => {
        updateClusterPositions(team, Array(unguessedWords.length).fill(null));
    };

    const getInitialPosition = useCallback(
        (index, ref = clusterRef.current) => {
            if (!ref || !wordHeight) return null;

            const clusterRect = ref.getBoundingClientRect();
            const clusterHeight = clusterRect.height;

            const topPadding = wordHeight / 2;
            const bottomPadding = wordHeight / 2;
            const leftPadding = wordHeight / 2;
            const availableHeight = clusterHeight - topPadding - bottomPadding;

            const rowSpacing = wordHeight * 2;
            const columnWidth = wordHeight * 6;

            const rowsPerColumn = Math.floor(availableHeight / rowSpacing);

            const col = Math.floor(index / rowsPerColumn);
            const row = index % rowsPerColumn;

            if (team === "assassin") {
                return {
                    x: leftPadding,
                    y: leftPadding,
                };
            }
            return {
                x: leftPadding + col * columnWidth,
                y: topPadding + row * rowSpacing,
            };
        },
        [team, wordHeight]
    );

    useEffect(() => {
        // Calculate initial positions
        if (clusterRef.current && unguessedWords.length > 0 && wordHeight > 0) {
            const newInitialPositions = unguessedWords.map((_, index) => {
                const position = getInitialPosition(index);
                return position;
            });

            setInitialPositions(newInitialPositions);
        }
    }, [unguessedWords, wordHeight, getInitialPosition]);

    const DirectionQueue = class {
        constructor(position, stepX, stepY) {
            this.baseDirections = [
                { x: stepX, y: 0, key: "right" }, // right
                { x: -stepX, y: 0, key: "left" }, // left
                { x: 0, y: stepY, key: "down" }, // down
                { x: 0, y: -stepY, key: "up" }, // up
            ];

            this.diagonalDirections = [
                { x: stepX, y: stepY, key: "downright" }, // down-right
                { x: -stepX, y: stepY, key: "downleft" }, // down-left
                { x: stepX, y: -stepY, key: "upright" }, // up-right
                { x: -stepX, y: -stepY, key: "upleft" }, // up-left
            ];

            this.directions = [...this.baseDirections];
            this.tried = new Set(); // Track tried positions
            this.wordCollisionDirs = new Set(); // Track directions that had word collisions
            this.basePosition = position;
            this.stepX = stepX;
            this.stepY = stepY;
        }

        addDiagonals() {
            this.directions.push(...this.diagonalDirections);
        }

        addExtendedDirections() {
            // Only extend directions that had word collisions
            const directionsToExtend = [
                ...this.baseDirections,
                ...this.diagonalDirections,
            ].filter((dir) => this.wordCollisionDirs.has(dir.key));

            directionsToExtend.forEach((dir) => {
                this.directions.push({
                    x: dir.x * 2,
                    y: dir.y * 2,
                    key: `${dir.key}_extended`,
                });
            });
        }

        markWordCollision(position) {
            // Find which direction this position came from
            const dx = position.x - this.basePosition.x;
            const dy = position.y - this.basePosition.y;

            // Find the matching direction
            const allDirs = [
                ...this.baseDirections,
                ...this.diagonalDirections,
            ];
            const matchingDir = allDirs.find(
                (dir) =>
                    Math.abs(dx - dir.x) < 0.1 && Math.abs(dy - dir.y) < 0.1
            );

            if (matchingDir) {
                this.wordCollisionDirs.add(matchingDir.key);
            }
        }

        getNextPosition() {
            while (this.directions.length > 0) {
                const dir = this.directions.shift();
                const newPosition = {
                    x: this.basePosition.x + dir.x,
                    y: this.basePosition.y + dir.y,
                    directionKey: dir.key,
                };

                const posKey = `${newPosition.x},${newPosition.y}`;
                if (!this.tried.has(posKey)) {
                    this.tried.add(posKey);
                    return newPosition;
                }
            }
            return null;
        }

        isEmpty() {
            return this.directions.length === 0;
        }
    };

    const adjustPosition = (position, index, allPositions) => {
        const container = constraintsRef.current;
        if (!container) return position;

        const containerBounds = container.getBoundingClientRect();
        const dimensions = wordDimensions[index] || { width: 0, height: 0 };
        const MOVE_STEP_X = dimensions.width;
        const MOVE_STEP_Y = dimensions.height;

        // Function to clamp absolute position ensuring entire word rectangle is in bounds
        const clampAbsolutePosition = (absPos) => {
            // Get the complete word rectangle at this position
            const rect = getRectForWord(index, {
                x: absPos.x - initialPositions[index].x,
                y: absPos.y - initialPositions[index].y,
            });

            // Adjust if out of bounds
            let newX = absPos.x;
            let newY = absPos.y;

            // Left boundary
            if (rect.left < 0) {
                newX = initialPositions[index].x;
            }
            // Right boundary
            if (rect.right > containerBounds.width) {
                newX = containerBounds.width - dimensions.width;
            }
            // Top boundary
            if (rect.top < 0) {
                newY = initialPositions[index].y;
            }
            // Bottom boundary
            if (rect.bottom > containerBounds.height) {
                newY = containerBounds.height - dimensions.height;
            }

            return { x: newX, y: newY };
        };

        // Calculate and clamp absolute position
        const absolutePosition = {
            x: initialPositions[index].x + position.x,
            y: initialPositions[index].y + position.y,
        };
        const clampedAbsolutePosition = clampAbsolutePosition(absolutePosition);

        // Convert back to offset
        const clampedOffset = {
            x: clampedAbsolutePosition.x - initialPositions[index].x,
            y: clampedAbsolutePosition.y - initialPositions[index].y,
        };

        // If clamped position is valid (no collisions), return it
        if (
            isPositionValid(clampedOffset, index, allPositions, containerBounds)
        ) {
            return clampedOffset;
        }

        // Create direction queue with initial cardinal directions
        let queue = new DirectionQueue(clampedOffset, MOVE_STEP_X, MOVE_STEP_Y);
        let attempts = 0;
        const MAX_ATTEMPTS = 100;

        while (attempts < MAX_ATTEMPTS) {
            if (queue.isEmpty()) {
                if (attempts < 8) {
                    queue.addDiagonals();
                } else if (attempts < 50 && queue.wordCollisionDirs.size > 0) {
                    queue.addExtendedDirections();
                } else {
                    // Last resort: random position within bounds
                    const maxX = containerBounds.width - dimensions.width;
                    const maxY = containerBounds.height - dimensions.height;
                    const randomAbsoluteX = Math.max(
                        0,
                        Math.min(maxX, Math.random() * maxX)
                    );
                    const randomAbsoluteY = Math.max(
                        0,
                        Math.min(maxY, Math.random() * maxY)
                    );

                    // Ensure random position is clamped
                    const clampedRandomPosition = clampAbsolutePosition({
                        x: randomAbsoluteX,
                        y: randomAbsoluteY,
                    });

                    return {
                        x: clampedRandomPosition.x - initialPositions[index].x,
                        y: clampedRandomPosition.y - initialPositions[index].y,
                    };
                }
            }

            const nextOffset = queue.getNextPosition();
            if (!nextOffset) break;

            // Calculate and clamp absolute position from the next offset
            const nextAbsolutePosition = {
                x: initialPositions[index].x + nextOffset.x,
                y: initialPositions[index].y + nextOffset.y,
            };
            const clampedNextAbsolutePosition =
                clampAbsolutePosition(nextAbsolutePosition);

            // Convert back to offset
            const clampedNextOffset = {
                x: clampedNextAbsolutePosition.x - initialPositions[index].x,
                y: clampedNextAbsolutePosition.y - initialPositions[index].y,
                directionKey: nextOffset.directionKey,
            };

            if (
                isPositionValid(
                    clampedNextOffset,
                    index,
                    allPositions,
                    containerBounds
                )
            ) {
                return clampedNextOffset;
            } else {
                const currentRect = getRectForWord(index, clampedNextOffset);
                let hasWordCollision = false;

                for (
                    let otherIndex = 0;
                    otherIndex < initialPositions.length;
                    otherIndex++
                ) {
                    if (otherIndex !== index) {
                        const otherRect = getRectForWord(
                            otherIndex,
                            allPositions[otherIndex]
                        );
                        if (checkCollision(currentRect, otherRect)) {
                            hasWordCollision = true;
                            break;
                        }
                    }
                }

                if (hasWordCollision) {
                    queue.markWordCollision(clampedNextOffset);
                }
            }

            attempts++;
        }

        // If no valid position found, return clamped offset
        return clampedOffset;
    };

    const getRectForWord = (index, position) => {
        const dimensions = wordDimensions[index] || { width: 0, height: 0 };
        const offset = position || { x: 0, y: 0 };

        return {
            left: initialPositions[index].x + offset.x,
            right: initialPositions[index].x + offset.x + dimensions.width,
            top: initialPositions[index].y + offset.y,
            bottom: initialPositions[index].y + offset.y + dimensions.height,
        };
    };

    const isPositionValid = (
        position,
        index,
        allPositions,
        containerBounds
    ) => {
        const currentRect = getRectForWord(index, position);

        // Check boundaries
        if (
            currentRect.left < 0 ||
            currentRect.right > containerBounds.width ||
            currentRect.top < 0 ||
            currentRect.bottom > containerBounds.height
        ) {
            return false;
        }

        // Check collisions with other words
        for (
            let otherIndex = 0;
            otherIndex < initialPositions.length;
            otherIndex++
        ) {
            if (otherIndex !== index) {
                const otherRect = getRectForWord(
                    otherIndex,
                    allPositions[otherIndex]
                );

                if (checkCollision(currentRect, otherRect)) {
                    return false;
                }
            }
        }

        return true;
    };

    const checkCollision = (rect1, rect2) => {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    };

    const handleDragEnd = (index, newPosition) => {
        const adjustedPosition = adjustPosition(newPosition, index, positions);
        const newPositions = [...positions];
        newPositions[index] = adjustedPosition;
        updateClusterPositions(team, newPositions);
    };

    const getTitle = () => {
        switch (team) {
            case "user":
                return "your team";
            case "computer":
                return "their team";
            case "bystander":
                return "bystanders";
            case "assassin":
                return "assassin";
            default:
                return "";
        }
    };

    return (
        <div
            ref={clusterRef}
            className="relative flex-col text-md w-full h-full"
        >
            <div
                className={clsx("rounded-md px-4 py-2 flex flex-col space-y-2")}
            >
                <h3
                    className={clsx(
                        "absolute -top-4 left-0 text-xl sm:text-2xl font-source-code-pro px-4 py-2 opacity-30",
                        {
                            "text-user-title": team === "user",
                            "text-computer-title": team === "computer",
                            "text-bystander": team === "bystander",
                            "text-button": team === "assassin",
                        }
                    )}
                >
                    {getTitle()}
                </h3>
                <div
                    className={clsx(
                        "absolute pt-6 inset-0 rounded-xl blur-lg",
                        {
                            "bg-dark-user": team === "user",
                            "bg-dark-computer": team === "computer",
                            "bg-dark-bystander": team === "bystander",
                            "bg-assassin": team === "assassin",
                        }
                    )}
                ></div>

                <motion.div
                    ref={constraintsRef}
                    className="absolute inset-0 flex-grow font-courier"
                >
                    <span
                        className="absolute opacity-0 pointer-events-none text-xs sm:text-sm md:text-md px-1"
                        ref={(el) => {
                            if (el) {
                                const rect = el.getBoundingClientRect();
                                setWordHeight(rect.height);
                            }
                        }}
                    >
                        measurement
                    </span>
                    {unguessedWords.map((word, index) => (
                        <Word
                            key={word.word} // Changed from index to word.word for stable keys
                            word={word}
                            constraintsRef={constraintsRef}
                            initialPosition={initialPositions[index]}
                            position={positions[index]}
                            onDragEnd={(newPosition) =>
                                handleDragEnd(index, newPosition)
                            }
                            onMeasure={(dimensions) =>
                                handleWordMeasure(index, dimensions)
                            }
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Cluster;
