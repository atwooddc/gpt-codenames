import React from "react";

const HeaderButtons = ({ toggleRules }) => {
    return (
        <div className="flex mx-6">
            <button
                className="text-button"
                onClick={toggleRules}
            >
                <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </button>
        </div>
    );
};

export default HeaderButtons;