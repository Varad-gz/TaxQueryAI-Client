'use client'
import React, { Suspense, useState } from 'react'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { IoChevronBack } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

import GoogleSigninButton from './GoogleSigninButton';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

const Signin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleSignIn = async () => {

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error(result.error);
                return
            }

            toast.success("Sign-in successful!");

            router.push("/interact");
        } catch (error) {
            console.error("Sign-in error:", error);
            toast.error(error.message || "Sign-in failed. Please try again.");
        }
    };

    return (
        <div className='w-full flex'>
            <div className='hidden md:block md:w-[50%] lg:w-[60%] bg-gradient-to-b from-gray-900 to-gray-800 h-screen text-white'>
                <div className='h-full flex flex-col justify-center items-center text-3xl lg:text-4xl px-10'>
                    Welcome! Time to unlock the mysteries of property tax—because knowledge <br />(and logging in) is power!
                </div>
            </div>
            <div className='w-full md:w-[50%] lg:w-[40%] h-screen px-5 py-10'>
                <div className='flex justify-between'>
                    <button onClick={() => { router.back() }} className='text-2xl flex items-center space-x-2.5 hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-95 transition ease-in-out delay-75 cursor-pointer'>
                        <IoChevronBack />
                        <span>Go Back</span>
                    </button>
                    <Link href='/' className='text-2xl flex items-center space-x-2.5 hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-95 transition ease-in-out delay-75 cursor-pointer'>
                        <FaHome />
                        <span>Go Home</span>
                    </Link>
                </div>
                <div className='text-4xl my-9'>Sign In</div>
                <Suspense>
                    <div className='flex flex-col justify-center items-center'>
                        <form className='flex flex-col w-full space-y-2' action={handleSignIn}>
                            <input type='email' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} required className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200'></input>
                            <input type='password' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} required className='bg-gray-50 px-2.5 py-5 rounded-lg border-[1px] border-gray-200'></input>
                            <button type='submit' className='w-fit rounded-2xl border-[2px] px-5 py-2.5 mt-2.5 font-bold hover:bg-black hover:text-white active:bg-black active:text-white outline-0 focus:bg-black focus:text-white transition ease-in-out delay-75 cursor-pointer'>Sign in</button>
                        </form>
                        <Link href='/forgot-password' className='text-lg hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0'>Forgot Password</Link>
                        <Link href='/signup' className='text-lg hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0'>Don't have an account? Sign up</Link>
                        <div className='w-full my-5 flex items-center'>
                            <div className='bg-black rounded-l-full h-1 w-full'></div>
                            <div className=' p-1 border-[2px] rounded-full font-bold flex items-center justify-center'>Or</div>
                            <div className='bg-black rounded-r-full h-1 w-full'></div>
                        </div>
                        <div className='flex flex-col items-center w-full'>
                            <GoogleSigninButton />
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    )
}

export default Signin
