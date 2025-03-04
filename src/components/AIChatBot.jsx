'use client'

import React, { useState, useRef, useEffect } from 'react'

import MessageContainer from './MessageContainer';
import QueryTextBox from './QueryTextBox'

const AIChatBot = ({ onSendMessage, messages, loading }) => {

    const [queryBoxHeight, setQueryBoxHeight] = useState(44);
    const queryBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        const updateHeight = () => {
            if (queryBoxRef.current) {
                setQueryBoxHeight(queryBoxRef.current.offsetHeight);
            }
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        if (queryBoxRef.current) {
            resizeObserver.observe(queryBoxRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div className='w-full rounded-lg border-[2px] border-[#EFEFEF] flex flex-col relative h-full'>
            <div className='w-full my-[10px] text-[20px] font-bold flex items-center px-[20px]'>
                <div>Ask AI</div>
            </div>
            <div
                className="w-full flex-1 overflow-auto flex justify-center px-[20px]"
                style={{ paddingBottom: `${queryBoxHeight + 16}px` }}
            >
                <MessageContainer
                    ref={messagesEndRef}
                    messages={messages}
                    loading={loading}
                    messagesType={2}
                />
            </div>
            <div ref={queryBoxRef} className="absolute w-full bottom-[10px]">
                <div className="mx-[10px]">
                    <QueryTextBox
                        placeholder="Message AI"
                        type={2}
                        onSendMessage={onSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AIChatBot
