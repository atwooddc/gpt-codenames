import React from "react";

const Switch = ({label, enabled, toggle}) => {
    return (
        <>
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={toggle}
                    className="sr-only"
                />
                <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                        enabled ? "bg-[#212b36]" : "bg-[#CCCCCE]"
                    }`}
                >
                    <span
                        className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                            enabled ? "translate-x-[28px]" : ""
                        }`}
                    ></span>
                </span>
                <span className="label flex items-center text-sm font-medium text-black">
                    {label}
                </span>
            </label>
        </>
    );
};

export default Switch;
