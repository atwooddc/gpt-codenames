import React from "react";

import useGameStore from "../../stores/gameStore";

const GameMessage = () => {
    const gameMessage = useGameStore((state) => state.gameMessage);

    return <p>{gameMessage}</p>;
};

export default GameMessage;
