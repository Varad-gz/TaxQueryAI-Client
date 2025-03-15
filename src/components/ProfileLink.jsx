'use client'

import { useAuth } from "@/contexts/AuthContext";

import React from 'react'
import Tooltip from "./Tooltop";
import Link from "next/link";

import { FaUserCircle } from "react-icons/fa";

const ProfileLink = () => {
    const { session, isLoading } = useAuth();

    return (
        <Tooltip text={isLoading ? 'Profile' : `${session.user.name}'s Profile`}>
            <Link href='/profile'>
                <div className='w-[40px] h-[40px] flex justify-center items-center rounded-full border-[1px] border-white hover:border-primaryAccent hover:scale-95 transition ease-in-out delay-75 overflow-hidden'>
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
                </div>
            </Link>
        </Tooltip>
    )
}

export default ProfileLink
