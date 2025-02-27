'use client'

import { useState } from "react";

const Tooltip = ({ text, children, pos, className }) => {
    const [visible, setVisible] = useState(false);

    let ttposition;
    if (typeof pos !== 'undefined') {
        switch (pos) {
            case 1:
                ttposition = 'bottom-full -left-1/2 mb-[8px]';
                break;
            case 3:
                ttposition = 'top-full -left-1/2 mt-[8px]';
                break;
            case 4:
                ttposition = 'right-full mr-[8px]';
                break;
            default:
                ttposition = 'left-full ml-[8px]';
        }
    } else {
        ttposition = 'left-full ml-[8px]';
    }

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className={`absolute ${ttposition} left whitespace-nowrap bg-gray-800 text-white text-sm px-[10px] py-[5px] rounded shadow-lg z-[9999] ${className}`}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
