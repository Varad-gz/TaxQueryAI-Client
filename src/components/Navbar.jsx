import React from 'react'
import Link from 'next/link'

import Tooltip from './Tooltop';

import { IoMdAnalytics } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { FaDatabase } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

const Navbar = () => {
    return (
        <>
            <div className='min-h-screen w-16 text-nowrap bg-zinc-900 text-white py-[20px] flex flex-col items-center'>
                <div className='mb-[30px]'>
                    <Tooltip text="Profile">
                        <Link href='/profile'>
                            <div className='w-[40px] h-[40px] rounded-full border-[1px] border-white hover:border-primaryAccent hover:scale-110 transition ease-in-out delay-75'><img src="favicon.ico" alt="" /></div>
                        </Link>
                    </Tooltip>
                </div>
                <div className='h-full flex flex-col items-center text-[35px]'>
                    <div className='flex flex-col'>
                        <Tooltip text="Analytics Dashboard">
                            <Link href='/dashboard'>
                                <div className='flex items-center hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 my-[10px]'>
                                    <IoMdAnalytics />
                                </div>
                            </Link>
                        </Tooltip>
                        <Tooltip text="Datasets">
                            <Link href='/datasets'>
                                <div className='flex items-center hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 my-[10px]'>
                                    <FaDatabase />
                                </div>
                            </Link>
                        </Tooltip>
                        <Tooltip text="Visualize Predictions">
                            <Link href='/visualize'>
                                <div className='flex items-center hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 my-[10px]'>
                                    <MdAutoGraph />
                                </div>
                            </Link>
                        </Tooltip>
                        <Tooltip text="Logout">
                            <Link href='/logout'>
                                <div className='flex items-center hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 my-[10px]'>
                                    <IoMdLogOut />
                                </div>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
