'use client'
import React from 'react'
import PreLoginNavbar from '@/components/PreLoginNavbar';
import { motion } from 'framer-motion';

const Home = () => {

    return (
        <div className='flex flex-col'>
            <PreLoginNavbar />
            <div className='h-[calc(100dvh-80px)] bg-gradient-to-b from-gray-900 to-primaryAccent transition-colors duration-300 ease-in-out flex flex-col justify-center items-center text-white select-none'>
                <motion.h2
                    className='text-6xl md:text-8xl mb-[30px]'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >TaxQueryAI</motion.h2>
                <motion.p
                    className='text-2xl w-[80%] md:w-1/2 text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    We simplify indian property tax queries with our advanced querying tool. Get instant answers, detailed analytics, and 24/7 support through our integrated chatbot. Let us handle the complexity, so you don’t have to.
                </motion.p>
            </div>
        </div>
    )
}

export default Home
