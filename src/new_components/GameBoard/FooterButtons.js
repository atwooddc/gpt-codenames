// gameHistory button: book

// shuffleWords button: interlaced arrows

// changeView button: table or grid depending on ViewContext

import React from "react";
import { useView } from "../../context/ViewContext";
import { triggerReset } from "../../services/resetPositionsEvent";
import { useWords } from "../../context/WordsContext";

const FooterButtons = ({}) => {
    const { view, toggleView } = useView();
    const { handleShuffle, outOfPosition } = useWords();

    return (
        <div className="flex justify-evenly items-center w-full text-button">
            <button disabled>
                <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
            </button>
            {view === "grid" || !outOfPosition ? (
                <button onClick={handleShuffle}>
                    <svg // shuffle
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {" "}
                        <polyline points="16 3 21 3 21 8" />{" "}
                        <line x1="4" y1="20" x2="21" y2="3" />{" "}
                        <polyline points="21 16 21 21 16 21" />{" "}
                        <line x1="15" y1="15" x2="21" y2="21" />{" "}
                        <line x1="4" y1="4" x2="9" y2="9" />
                    </svg>
                </button>
            ) : (
                <button
                    onClick={triggerReset}
                    disabled={!outOfPosition}
                    className="disabled:opacity-50"
                >
                    <svg // reset
                        className="h-8 w-8"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />{" "}
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
                    </svg>
                </button>
            )}

            <button onClick={toggleView}>
                {view === "grid" ? (
                    <svg
                        className="h-8 w-8"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {" "}
                        <path stroke="none" d="M0 0h24v24H0z" />{" "}
                        <rect x="4" y="4" width="16" height="16" rx="2" />{" "}
                        <line x1="4" y1="10" x2="20" y2="10" />{" "}
                        <line x1="10" y1="4" x2="10" y2="20" />
                    </svg>
                ) : (
                    <svg
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {" "}
                        <rect x="3" y="3" width="7" height="7" />{" "}
                        <rect x="14" y="3" width="7" height="7" />{" "}
                        <rect x="14" y="14" width="7" height="7" />{" "}
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default FooterButtons;

// https://www.tailwindtoolbox.com/icons
