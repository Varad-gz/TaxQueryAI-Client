"use client";

import React, { useEffect, useState } from "react";

const SecureIframePortal = ({ src }) => {
    const [error, setError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 } // Trigger when 10% of the iframe is visible
        );

        const portalRoot = document.getElementById("portal-root");
        observer.observe(portalRoot);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const iframe = document.createElement("iframe");

        iframe.src = src;
        iframe.style.width = "100%";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
        iframe.setAttribute("allow", "fullscreen");

        iframe.onload = () => setIsLoading(false);
        iframe.onerror = () => {
            setError(true);
            setIsLoading(false);
        };

        const portalRoot = document.getElementById("portal-root");
        portalRoot.appendChild(iframe);

        return () => {
            portalRoot.removeChild(iframe);
        };
    }, [src, isVisible]);

    if (error) {
        return <p>Failed to load the embedded content.</p>;
    }

    return (
        <div>
            {(!isVisible || isLoading) && (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primaryAccent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default SecureIframePortal;