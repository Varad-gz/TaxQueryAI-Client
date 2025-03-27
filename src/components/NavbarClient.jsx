"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { RiMenu2Line } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarClient() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        setIsNavOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.classList.add('no-transition');

        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsNavOpen(true);
            } else {
                setIsNavOpen(false);
            }
        };

        checkScreenSize();

        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 50);

        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 text-white z-40 flex items-center px-4">
                <div className="absolute left-4">
                    <button
                        className="rounded-md md:hidden cursor-pointer"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        aria-label="Toggle navigation"
                    >
                        <RiMenu2Line size={22} />
                    </button>
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center">
                            <Link href='/interact'>
                                <h1 className="text-lg font-medium">{isMobile ? 'TQAI' : 'TaxQueryAI'}</h1>
                            </Link>
                            <span className="text-gray-500 ml-2 text-sm">{'(MySQL Database Q&A Tool)'}</span>
                        </div>
                        <span className="text-sm w-fit whitespace-nowrap">As per 2013-18</span>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobile && isNavOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-20 mt-16"
                    onClick={() => setIsNavOpen(false)}
                />
            )}

            {/* Sidebar Navbar - now positioned below the header */}
            <div className={`
                fixed top-16 bottom-0 z-30 transition-transform duration-300 ease-in-out
                ${isMobile && !isNavOpen ? "-translate-x-full" : "translate-x-0"}
            `}>
                <Navbar />
            </div>

            {/* Content spacer to push content below the header */}
            <div className="h-16"></div>
        </>
    );
}