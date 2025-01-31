import React from "react";

import useGameStore from "../../stores/gameStore";

const ClickToAdvance = () => {
    const show = useGameStore((state) => state.showClickToAdvance);

    return (show && <p className="italic text-popup">Click to Advance</p>);
};

export default ClickToAdvance;
