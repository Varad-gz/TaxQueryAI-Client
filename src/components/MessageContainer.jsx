import React from 'react';

import { FaBolt } from "react-icons/fa";
import { MdRealEstateAgent } from 'react-icons/md';

import Message from '@/components/Message';

const MessageContainer = ({ messages, ref, loading, messagesType }) => {
    return (
        <div className={`w-full flex flex-col items-center overflow-auto overflow-x-hidden scrollbar-none h-full`}>
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <Message
                        key={index}
                        type={msg.type === 'user' ? (messagesType === 1 ? 1 : 3) : (messagesType === 1 ? 2 : 4)}
                        isFirst={index === 0}
                    >
                        {msg.text}
                    </Message>
                ))
            ) : (
                messagesType === 1 ?
                    <div className='w-full h-full flex flex-col justify-center items-center text-gray-600 font-bold'>
                        <MdRealEstateAgent className='text-[60px] text-primaryAccent' />
                        <div className='text-sm sm:text-md md:text-xl select-none mt-[20px]'>
                            Start by asking: What are the possible questions I can ask?
                        </div>
                    </div> :
                    <div className='w-full h-full flex flex-col justify-center items-center text-primaryAccent font-bold'>
                        <FaBolt className='text-[40px]' />
                        <div className='text-[20px] select-none'>
                            Ask your queries to the AI
                        </div>
                    </div>
            )}
            {
                loading &&
                <div className="w-full flex space-x-1 my-[20px] justify-center">
                    <div className="w-[8px] h-[8px] bg-primaryAccent rounded-full animate-bounce"></div>
                    <div className="w-[8px] h-[8px] bg-primaryAccent rounded-full animate-bounce delay-100"></div>
                    <div className="w-[8px] h-[8px] bg-primaryAccent rounded-full animate-bounce delay-200"></div>
                </div>
            }
            <div ref={ref}></div>
        </div>
    );
}

export default MessageContainer;
