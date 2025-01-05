import React from "react";

import GameMessage from "./InfoBar/GameMessage";
import ClueInput from "./InfoBar/ClueInput";


const InfoBar = () => {
    return (
        <div className="flex flex-col items-center space-y-4 pt-4">
            <GameMessage />

            <ClueInput />
        </div>
    );
};

export default InfoBar;
