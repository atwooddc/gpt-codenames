import React from "react";

const Legend = ({ setHoveredTeam }) => {
    const teams = [
        { color: "#17739e", label: "Your Team", team: "user" },
        { color: "#d81c2c", label: "Their Team", team: "computer" },
        { color: "#aeae99", label: "Bystanders", team: "bystander" },
        { color: "black", label: "Assassin", team: "assassin" },
    ];

    return (
        <div className="flex flex-col space-y-2">
            {teams.map(({ color, label, team }) => (
                <div
                    key={team}
                    className="flex items-center space-x-1"
                    onMouseEnter={() => setHoveredTeam(team)}
                    onMouseLeave={() => setHoveredTeam(null)}
                >
                    <div
                        style={{ backgroundColor: color }}
                        className="w-4 h-4 rounded"
                    ></div>
                    <span className= "text-gray-500 text-sm">{label}</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;