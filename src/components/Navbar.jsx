import React from 'react'
import Link from 'next/link'

import Tooltip from './Tooltop';

import { IoMdAnalytics } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { FaDatabase } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

import { signOut } from 'next-auth/react';
import ProfileLink from './ProfileLink';

const handleLogout = async () => {
    signOut({ redirect: true, callbackUrl: '/' })
}

const Navbar = () => {
    return (
        <>
            <div className='min-h-screen w-16 text-nowrap bg-zinc-900 text-white flex flex-col items-center z-10'>
                <div className='mb-[30px]'>
                    <ProfileLink />
                </div>
                <div className='h-full flex flex-col items-center text-[35px]'>
                    <div className='flex flex-col space-y-5'>
                        <Tooltip text="Analytics Dashboard">
                            <Link href='/dashboard' className='flex items-center hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-110 transition ease-in-out delay-75'>
                                <IoMdAnalytics />
                            </Link>
                        </Tooltip>
                        <Tooltip text="Datasets">
                            <Link href='/datasets' className='flex items-center hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-110 transition ease-in-out delay-75'>
                                <FaDatabase />
                            </Link>
                        </Tooltip>
                        <Tooltip text="Visualize Predictions">
                            <Link href='/visualize' className='flex items-center hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-110 transition ease-in-out delay-75'>
                                <MdAutoGraph />
                            </Link>
                        </Tooltip>
                        <Tooltip text="Logout">
                            <button onClick={handleLogout} className='flex items-center hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-110 transition ease-in-out delay-75 cursor-pointer'>
                                <IoMdLogOut />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
