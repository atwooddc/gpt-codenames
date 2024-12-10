import React, { createContext, useState, useContext } from "react";

// Create the context
const ViewContext = createContext();

// Custom hook for accessing the context
export const useView = () => useContext(ViewContext);

// Provider component
export const ViewProvider = ({ children }) => {
    const [view, setView] = useState("table"); // Default to grid view

    const toggleView = () => {
        setView((prevView) => (prevView === "grid" ? "table" : "grid"));
    };

    return (
        <ViewContext.Provider value={{ view, toggleView }}>
            {children}
        </ViewContext.Provider>
    );
};
