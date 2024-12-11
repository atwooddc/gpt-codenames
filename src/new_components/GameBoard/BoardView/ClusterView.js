import React from "react";
import Cluster from "./Cluster";

const ClusterView = () => {
    return (
        <div className="w-full h-full grid grid-rows-7 grid-cols-2 gap-4">
            {/* User Cluster (Top row, spans two columns) */}
            <div className="row-span-3 col-span-2 h-full">
                <Cluster team={"user"} />
            </div>

            {/* Computer Cluster (Bottom-left quadrant) */}
            <div className="row-span-4 col-span-1 h-full">
                <Cluster team={"computer"} />
            </div>

            {/* Assassin and Bystander Clusters (Bottom-right quadrant) */}
            <div className="row-span-4 col-span-1 grid grid-rows-7 gap-4 h-full">
                {/* Assassin (1/4 height) */}
                <div className="row-span-2 h-full">
                    <Cluster team={"assassin"} />
                </div>

                {/* Bystander (3/4 height) */}
                <div className="row-span-5 h-full">
                    <Cluster team={"bystander"} />
                </div>
            </div>
        </div>
    );
};

export default ClusterView;