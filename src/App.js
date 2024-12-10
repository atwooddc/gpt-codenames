import React from "react";

import { ViewProvider } from "./context/ViewContext";
import { WordsProvider } from "./context/WordsContext";

import Header from "./new_components/Header";
import GameBoard from "./new_components/GameBoard";
import Credits from "./new_components/Credits";

const App = () => {
    return (
        <div className="min-h-screen bg-background py-2 flex flex-col text-white">
            <Header />

            <ViewProvider>
                <WordsProvider>
                    <GameBoard />
                </WordsProvider>
            </ViewProvider>

            <Credits />
        </div>
    );
};

export default App;
