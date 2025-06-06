'use client'

import React, { useState, useRef, useEffect } from 'react';
import MessageContainer from './MessageContainer';
import QueryTextBox from './QueryTextBox';
import { useAIMessages } from '@/contexts/AIMessageContext';

const AIChatBot = () => {
    const [loading, setLoading] = useState(false);
    const [queryBoxHeight, setQueryBoxHeight] = useState(44);
    const queryBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

    const { aiMessages, setAIMessages } = useAIMessages();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [aiMessages, loading]);

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

    const handleSendMessage = async (userMessage) => {
        if (!userMessage.trim()) return;

        setAIMessages((prevMessages) => [...prevMessages, { text: userMessage, type: 'user' }]);
        setLoading(true);

        try {
            const response = await fetch('https://pratyush770.pythonanywhere.com/api/get_ai_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            const data = await response.json();
            setAIMessages((prevMessages) => [...prevMessages, { text: data.response, type: 'ai' }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setAIMessages((prevMessages) => [
                ...prevMessages,
                { text: "I couldn't find anything related to that. Can you please rephrase your query?", type: 'ai' }
            ]);
        } finally {
            setLoading(false);
        }
    };

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
                    messages={aiMessages}
                    loading={loading}
                    messagesType={2}
                />
            </div>
            <div ref={queryBoxRef} className="absolute w-full bottom-[10px]">
                <div className="mx-[10px]">
                    <QueryTextBox
                        placeholder="Message AI"
                        type={2}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AIChatBot;
