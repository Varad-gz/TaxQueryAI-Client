import React from 'react';
import Message from '@/components/Message';

const MessageContainer = ({ messages }) => {
    return (
        <div className='max-w-[60%] w-full flex flex-col items-start overflow-auto overflow-x-hidden scrollbar-none mt-[-20px]'>
            {messages.map((msg, index) => (
                <Message key={index} type={msg.type === 'user' ? 0 : 1}>
                    {msg.text}
                </Message>
            ))}
        </div>
    );
}

export default MessageContainer;
