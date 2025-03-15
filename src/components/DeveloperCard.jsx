import Link from 'next/link';
import React from 'react'

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const DeveloperCard = ({ name, githubLink = '#', linkedinLink = '#' }) => {
    return (
        <div className='md:w-[300px] h-[200px] text-2xl flex flex-col justify-center items-center px-5 py-2.5 border-[1px] rounded-lg font-semibold hover:scale-105 transition ease-in-out'>
            <span>
                {name}
            </span>
            <div className='flex flex-row mt-[20px] space-x-3 text-5xl'>
                <Link href={githubLink} className='hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-95 transition ease-in-out cursor-pointer' >
                    <FaGithub />
                </Link>
                <Link href={linkedinLink} className='hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-95 transition ease-in-out cursor-pointer' >
                    <FaLinkedin />
                </Link>
            </div>
        </div>
    )
}

export default DeveloperCard
