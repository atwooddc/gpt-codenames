import React, { useEffect } from "react";

import { ViewProvider } from "./context/ViewContext";

import Header from "./new_components/Header";
import GameBoard from "./new_components/GameBoard";
import InfoBar from "./new_components/InfoBar";
import Credits from "./new_components/Credits";

import useGameStore from "./stores/gameStore";

import { WordsProvider } from "./context/WordsContext";

const App = () => {
    const initializeWords = useGameStore((state) => state.initializeWords);

    useEffect(() => {
        initializeWords();
    }, [initializeWords]);

    return (
        <div className="min-h-screen bg-background py-2 flex flex-col text-white">
            <Header />

            <ViewProvider>
                <WordsProvider>
                    <GameBoard />
                </WordsProvider>
            </ViewProvider>

            <InfoBar />

            <Credits />
        </div>
    );
};

export default App;
