import { React } from "react";
import Card from "./Card";

const Grid = ({ words }) => {
    return (
        <div className="grid grid-cols-5 gap-2 sm:gap-2 md:gap-3 lg:gap-4 w-full">
            {words.map((wordObj, index) => (
                <Card
                    key={index}
                    wordObj={wordObj}
                />
            ))}
        </div>
    );
};

export default Grid;
