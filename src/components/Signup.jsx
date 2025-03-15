'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { IoChevronBack } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

import { motion, AnimatePresence } from 'framer-motion';

import SignupEmailComponent from './SignupEmailComponent';
import SignupPasswordComponent from './SignupPasswordComponent';
import SignupPersonalInfoComponent from './SignupPersonalInfoComponent';
import { toast } from 'react-toastify';

const Signup = () => {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const router = useRouter();

    const nextStep = (values) => {
        setFormData({ ...formData, ...values });
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleSignUp = async (values) => {

        try {
            const response = await fetch("/api/profile/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email, password: formData.password, fullName: values.fullName }),
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }

            toast.success('User signed up successfully', {
                onClose: () => {
                    router.push("/signin");
                },
            })
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div className='w-full flex'>
            <div className='hidden md:block md:w-[50%] lg:w-[60%] bg-gradient-to-b from-gray-900 to-gray-800 h-screen text-white'>
                <div className='h-full flex flex-col justify-center items-center text-3xl lg:text-4xl px-10'>
                    Get started on your property tax journey—because taxes wait for no one, but at least we make it painless!
                </div>
            </div>
            <div className='w-full md:w-[50%] lg:w-[40%] h-screen px-5 py-10'>
                <div className='flex justify-between'>
                    <button onClick={() => { router.back() }} className='text-2xl flex items-center space-x-2.5 hover:text-primaryAccent hover:scale-95 transition ease-in-out delay-75 cursor-pointer'>
                        <IoChevronBack />
                        <span>Go Back</span>
                    </button>
                    <Link href='/' className='text-2xl flex items-center space-x-2.5 hover:text-primaryAccent hover:scale-95 transition ease-in-out delay-75 cursor-pointer'>
                        <FaHome />
                        <span>Go Home</span>
                    </Link>
                </div>
                <div className='text-4xl my-9'>Sign Up</div>
                <div className='flex flex-col justify-center items-center space-y-10'>
                    <motion.div className="w-full">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SignupEmailComponent nextStep={nextStep} />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SignupPasswordComponent nextStep={nextStep} prevStep={prevStep} />
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="personalInfo"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <SignupPersonalInfoComponent handleSubmit={handleSignUp} prevStep={prevStep} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <Link href='/signin' className='text-lg hover:text-primaryAccent'>Already have an account? Sign in</Link>
                </div>
            </div>
        </div>
    )
}


export default Signup
