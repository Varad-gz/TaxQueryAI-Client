import Link from 'next/link'
import React from 'react'

const PreLoginNavbar = () => {
    return (
        <div className='w-full h-[80px] px-[20px] md:px-[40px] flex justify-between items-center'>
            <h1 className='text-3xl md:text-4xl font-bold'>TaxQueryAI</h1>
            <div className='text-md md:text-lg'>
                <Link href='/signin' className='border-[2px] rounded-lg px-2.5 py-1.5 font-bold cursor-pointer hover:bg-black hover:text-white active:bg-black active:text-white focus:bg-black focus:text-white  outline-0 transition ease-in-out delay-75'>Sign in</Link>
            </div>
        </div>
    )
}

export default PreLoginNavbar
