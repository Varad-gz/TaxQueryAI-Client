'use client'

import { useAuth } from "@/contexts/AuthContext";

import React, { useState, useRef, useEffect } from 'react'
import Tooltip from "./Tooltop";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";

import ProfileEdit from "./ProfileEdit";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const ProfileLink = () => {
    const { session, isLoading } = useAuth();
    const [profileMenu, setProfileMenu] = useState(false);
    const profileRef = useRef(null);
    const pathname = usePathname();

    const handleClick = () => {
        if (!isLoading) {
            setProfileMenu(!profileMenu);
        }
    }

    useEffect(() => {
        setProfileMenu(false);
    }, [pathname]);

    return (
        <>
            <AnimatePresence>
                {profileMenu &&
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <ProfileEdit ref={profileRef} user={session.user} />
                    </motion.div>
                }
            </AnimatePresence>
            <Tooltip text={isLoading ? 'Profile' : `${session.user.name}'s Profile`}>
                <button onClick={handleClick} className='w-[40px] h-[40px] flex justify-center items-center rounded-full border-[1px] border-white hover:border-primaryAccent focus:border-primaryAccent active:border-primaryAccent outline-0 hover:scale-95 transition ease-in-out delay-75 overflow-hidden cursor-pointer'>
                    {isLoading ? (
                        <div className='w-4 h-4 border-2 border-primaryAccent border-t-transparent rounded-full animate-spin'></div>
                    ) :
                        (
                            session.user.image ?
                                < img
                                    src={session.user.image}
                                    alt="Profile Picture"
                                    className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
                                /> :
                                <FaUserCircle className="text-4xl" />
                        )
                    }
                </button>
            </Tooltip>
        </>
    )
}

export default ProfileLink
