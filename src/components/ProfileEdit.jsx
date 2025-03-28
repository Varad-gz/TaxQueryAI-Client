import React from 'react'

import { FaUserCircle } from "react-icons/fa";

const ProfileEdit = ({ user }) => {
    return (
        <div className='fixed top-[5px] left-[69px] text-black bg-white p-10 rounded-lg border-[2px] border-[#e3e3e3] flex flex-col space-y-4'>
            <div className='text-3xl'>
                Profile
            </div>
            {(
                user.image ?
                    < img
                        src={user.image}
                        alt="Profile Picture"
                        className={`w-[100px] h-[100px] object-cover`}
                    /> :
                    <div className='flex items-center space-x-2'>
                        <FaUserCircle className="text-4xl" />
                        <span>Profile picture not set</span>
                    </div>
            )}
            <div>
                <div>Name: {user.name}</div>
                <div>Email: {user.email}</div>
            </div>
        </div>
    )
}

export default ProfileEdit
