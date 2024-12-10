import React from "react";
import Cluster from "./Cluster";

const ClusterView = () => {
    return (
        <div
            className={'grid grid-rows-7 grid-cols-2 w-full gap-4 aspect-square non-mobile:aspect-[4/3] md:aspect-[16/9]'}
        >
            {/* User Cluster (Top row, spans two columns) */}
            <div className="row-span-3 col-span-2">
                <Cluster team={"user"} />
            </div>

            {/* Computer Cluster (Bottom-left quadrant) */}
            <div className="row-span-4 col-span-1">
                <Cluster team={"computer"} />
            </div>

            {/* Assassin and Bystander Clusters (Bottom-right quadrant) */}
            <div className="row-span-4 col-span-1 grid grid-rows-7 gap-4">
                {/* Assassin (1/4 height) */}
                <div className="row-span-2">
                    <Cluster team={"assassin"} />
                </div>

                {/* Bystander (3/4 height) */}
                <div className="row-span-5">
                    <Cluster team={"bystander"} />
                </div>
            </div>
        </div>
    );
};

export default ClusterView;
