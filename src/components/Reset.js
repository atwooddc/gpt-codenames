import React from "react";

const Reset = ({ handleResetClick, confirmReset }) => {
    return (
        <button
            className={`rounded-lg px-4 py-2 ${
                confirmReset
                    ? "bg-red-600 text-white"
                    : "bg-gray-600 text-white"
            }`}
            onClick={handleResetClick}
        >
            {confirmReset ? "Sure?" : "Reset"}
        </button>
    );
};

export default Reset;
