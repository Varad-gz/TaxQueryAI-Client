import Link from 'next/link'
import React from 'react'

const Home = () => {
    return (
        <div className='flex flex-col'>
            <Link href='/signin'>Sign In</Link>
            <Link href='/signup'>Sign Up</Link>
            <Link href='/interact'>Interact</Link>
        </div>
    )
}

export default Home
