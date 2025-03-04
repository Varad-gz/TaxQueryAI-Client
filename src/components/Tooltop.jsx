'use client'

import { useState } from "react";

const Tooltip = ({
    text,
    children,
    position = "right",
    className = "",
    delay = 0,
    arrow = true,
}) => {
    const [visible, setVisible] = useState(false);

    // Map position names to tailwind classes
    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    // Get position class or use default
    const positionClass = positionClasses[position] || positionClasses.right;

    // Arrow classes based on position
    const arrowClass = arrow ? {
        top: "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:border-8 after:border-transparent after:border-t-gray-800",
        bottom: "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-full after:border-8 after:border-transparent after:border-b-gray-800",
        left: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-8 after:border-transparent after:border-l-gray-800",
        right: "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:right-full after:border-8 after:border-transparent after:border-r-gray-800",
    }[position] : "";

    const handleMouseEnter = () => {
        if (delay > 0) {
            setTimeout(() => setVisible(true), delay);
        } else {
            setVisible(true);
        }
    };

    return (
        <div
            className={`relative inline-flex ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setVisible(false)}
            onFocus={handleMouseEnter}
            onBlur={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div
                    className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow whitespace-nowrap ${positionClass} ${arrowClass}`}
                    role="tooltip"
                >
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;