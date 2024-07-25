import React, { useState, useRef, useEffect } from "react";

const ModelSelector = ({ model, setModel }) => {
    const [selectorWidth, setSelectorWidth] = useState(0);
    const [selectorOffset, setSelectorOffset] = useState(0);
    const modelRefs = useRef([]);
    modelRefs.current = [];

    const models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"];

    const addToRefs = (el) => {
        if (el && !modelRefs.current.includes(el)) {
            modelRefs.current.push(el);
        }
    };

    const updateDimensions = () => {
        const index = models.indexOf(model);
        const currentElement = modelRefs.current[index];
        if (currentElement) {
            // Ensure that any padding or border included in the element is considered
            const style = window.getComputedStyle(currentElement);
            const marginLeft = parseInt(style.marginLeft, 10);
            const marginRight = parseInt(style.marginRight, 10);
            const width = currentElement.offsetWidth + marginLeft + marginRight;
            const left = currentElement.offsetLeft - marginLeft; // Adjust if there is a margin

            setSelectorWidth(width+6);
            setSelectorOffset(left-3);
        }
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [model]);

    return (
        <div className="flex flex-col justify-center items-center mt-4">
            <span className="label items-center text-sm font-medium text-black mb-2">
                GPT Model
            </span>
            <div className="relative flex w-full bg-gray-200 rounded-xl p-1 ">
                <div
                    className="absolute top-0 bottom-0 bg-white rounded-xl shadow transition-all duration-300"
                    style={{ width: `${selectorWidth}px`, left: `${selectorOffset}px` }}
                ></div>
                {models.map((m, index) => (
                    <button
                        key={index}
                        ref={addToRefs}
                        className={`flex-auto text-center px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                            model === m ? "text-black z-10" : "text-gray-500"
                        }`}
                        onClick={() => setModel(m)}
                        style={{ position: 'relative' }}
                    >
                        {m.replace("gpt-", "")}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModelSelector;
