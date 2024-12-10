import React from "react";
import headerImage from "../assets/header.svg";

const Header = () => {
    return (
        <div>
          <img
            src={headerImage}
            alt="Counterintelligence Header"
            className="w-full sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 mx-auto"
          />
        </div>
      );;
};

export default Header;
