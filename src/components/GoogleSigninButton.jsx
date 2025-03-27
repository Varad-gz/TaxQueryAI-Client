'use client'

import React from 'react'

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const GoogleSigninButton = () => {

    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const response = await signIn('google', { redirect: false })

        if (response.error) {
            toast.error(response.error);
            return
        }

        router.push('/interact');
    }

    return (
        <button onClick={handleGoogleSignIn} className='flex items-center border-2 rounded-2xl w-fit whitespace-nowrap p-3 font-bold space-x-5 hover:bg-black hover:text-white active:bg-black active:text-white focus:bg-black focus:text-white outline-0 transition ease-in-out delay-75 cursor-pointer'>
            <FcGoogle className='text-2xl' />
            <span>Sign in with Google</span>
        </button>
    )
}

export default GoogleSigninButton
