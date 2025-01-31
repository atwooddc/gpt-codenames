import React from "react";

import GameMessage from "./InfoBar/GameMessage";
import ClueInput from "./InfoBar/ClueInput";
import ClickToAdvance from "./InfoBar/ClickToAdvance";

const InfoBar = () => {
    return (
        <div className="flex flex-col items-center space-y-4 pt-4">
            <GameMessage />

            <ClueInput />

            <ClickToAdvance />
        </div>
    );
};

export default InfoBar;
