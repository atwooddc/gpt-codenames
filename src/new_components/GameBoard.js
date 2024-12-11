import { React, useState } from "react";
import HeaderButtons from "./GameBoard/HeaderButtons";
import FooterButtons from "./GameBoard/FooterButtons";
import RulesPopUp from "./GameBoard/RulesPopUp";
import GridView from "./GameBoard/BoardView/GridView";
import ClusterView from "./GameBoard/BoardView/ClusterView";
import { useView } from "../context/ViewContext";

const GameBoard = () => {
    const [showRules, setShowRules] = useState(false);
    const { view } = useView();

    const toggleRules = () => {
        setShowRules(!showRules);
    };

    return (
        <div className="flex flex-col space-y-8 -mt-8 px-4 lg:mt-0 mx-auto w-full sm:w-4/5 md:w-4/5 lg:w-3/5 xl:w-1/2 2xl:w-2/5">
            <HeaderButtons toggleRules={toggleRules} />
            {showRules && <RulesPopUp closeRules={toggleRules} />}

            <div className="relative aspect-[4/3] md:aspect-[16/9] w-full">
                    {view === "grid" && <GridView />}
                    {view === "table" && <ClusterView />}
            </div>

            <FooterButtons />
        </div>
    );
};

export default GameBoard;