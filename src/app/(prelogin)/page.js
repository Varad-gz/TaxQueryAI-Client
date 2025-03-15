'use client'
import React from 'react'

import DeveloperCard from '@/components/DeveloperCard';
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
            <div className='p-[40px] text-center'>
                <h3 className='text-4xl font-bold mb-[30px]'>Meet the Developers</h3>
                <motion.div
                    className='flex flex-col md:flex-row justify-center space-y-10 md:space-x-10'
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <DeveloperCard name="Varad Pandit" githubLink='https://github.com/Varad-gz' linkedinLink='https://www.linkedin.com/in/pandit-varad' />
                    <DeveloperCard name="Pratyush Majumdar" githubLink='https://github.com/pratyush770' linkedinLink='https://www.linkedin.com/in/pratyush-majumdar' />
                </motion.div>
            </div>
            <div className='bg-zinc-900 h-[100px] text-white flex items-center justify-center'>
                <span>TaxQueryAI 2025</span>
            </div>
        </div>
    )
}

export default Home
