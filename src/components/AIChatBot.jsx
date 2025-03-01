import React from 'react'

import { FaBolt } from "react-icons/fa";

import QueryTextBox from './QueryTextBox'

const AIChatBot = ({ onSendMessage }) => {
    return (
        <div className='w-[40%] ml-[10px] rounded-sm bg-zinc-900 px-[10px] py-[10px] flex flex-col'>
            <div className='flex-1 flex flex-col justify-center items-center text-primaryAccent font-bold'>
                <FaBolt className='text-[40px]' />
                <div className='text-[30px] select-none'>
                    Ask your queries to the AI
                </div>
            </div>
            <QueryTextBox placeholder="Message AI" type={2} onSendMessage={onSendMessage} />
        </div>
    );
};

export default AIChatBot
