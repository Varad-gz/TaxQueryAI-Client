'use client'

import React, { useState, useRef, useEffect } from 'react'
import QueryTextBox from '@/components/QueryTextBox';
import MessageContainer from '@/components/MessageContainer';
import AIChatBot from '@/components/AIChatBot';
import Tooltip from '@/components/Tooltop';
import { FaBolt } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { SiHelpscout } from "react-icons/si";


const Interact = () => {
    const [queryBoxHeight, setQueryBoxHeight] = useState(44);
    const [isAIVisible, setIsAIVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastUserQuery, setLastUserQuery] = useState(null);
    const [responseLoading, setResponseLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const queryBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleAIVisibility = () => {
        setIsAIVisible(!isAIVisible);
    };

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, responseLoading]);

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

    const getSQLQuery = async (previousQuery) => {
        if (!previousQuery) return "I couldn't find a previous query to generate SQL for.";

        setResponseLoading(true);

        try {
            const response = await fetch('https://taxqueryai.onrender.com/api/get_sql_query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: previousQuery, last_response: messages[messages.length - 1]?.text }) // Send last AI response
            });

            const data = await response.json();
            setResponseLoading(false);
            return data.sql_query || "Couldn't generate SQL for the last query.";

        } catch (error) {
            console.error("Error fetching SQL query:", error);
            setResponseLoading(false);
            return "An error occurred while fetching the SQL query.";
        }
    };

    const breakdown = async (previousQuery) => {
        if (!previousQuery) return "I couldn't find a previous query to provide a breakdown.";

        setResponseLoading(true);

        try {
            const response = await fetch('https://taxqueryai.onrender.com/api/get_breakdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: previousQuery, last_response: messages[messages.length - 1]?.text })
            });

            const data = await response.json();
            setResponseLoading(false);
            return data.breakdown || "Couldn't provide a breakdown for the last query.";

        } catch (error) {
            console.error("Error fetching breakdown:", error);
            setResponseLoading(false);
            return "An error occurred while fetching the breakdown.";
        }
    };

    const handleEdgeCases = async (userQuery) => {
        // Edge case handling code (unchanged)
        // ...same as before...
        userQuery = userQuery.trim().toLowerCase();

        const welcomeMessages = new Set(["hi", "hello", "how are you?", "hey", "hey there"]);
        const politeMessages = new Set(["thanks", "thank you", "thx", "appreciate it", "ty", "okay thanks", "thnx", "okay thank you"]);
        const queryKeywords = ["give me sql", "provide sql", "show sql", "fetch sql", "generate sql", "sql query", "give me query", "give me the sql query"];
        const cityKeywords = ["cities", "tables", "database", "available", "names"];
        const questionKeywords = ["possible", "questions", "ask", "type"];
        const breakdownKeywords = ["breakdown", "detailed explanation", "explanation", "brief"];
        const goodbyeMessages = new Set(["bye", "goodbye", "okay bye", "see you"]);

        if (welcomeMessages.has(userQuery)) return "Hey! How's it going?";
        if (politeMessages.has(userQuery)) return "You're welcome! Let me know if you have any more questions.";
        if (queryKeywords.some(kw => userQuery.includes(kw))) return await getSQLQuery(lastUserQuery);
        if (breakdownKeywords.some(kw => userQuery.includes(kw))) return await breakdown(lastUserQuery);
        if (cityKeywords.some(kw => userQuery.includes(kw))) return "The available tables in the database are Pune, Solapur, Chennai, Erode, Jabalpur, Thanjavur, and Tiruchirappalli.";
        if (questionKeywords.some(kw => userQuery.includes(kw))) {
            return `
  The possible questions you can ask are:
  * What was the total property tax collection in 2013-14 residential for Aundh in Pune city?
  * What was the property efficiency for the year 2015-16 commercial for Chennai?
  * What was the collection gap for the year 2016-17 residential for Thanjavur?
  * What was the collection gap for Solapur from 2013-18 residential?
  * What will be the tax demand for the year 2025 in Pune for residential?
  * What will be the property efficiency (residential) for the year 2019 in Pune?
`
        }
        if (goodbyeMessages.has(userQuery)) return "Goodbye! Catch you later.";

        return null;
    };

    const handleUserMessage = async (message) => {
        // Message handling code (unchanged)
        // ...same as before...
        if (!message.trim()) return;

        setMessages((prevMessages) => [...prevMessages, { text: message, type: 'user' }]);

        const edgeCaseResponse = await handleEdgeCases(message);
        if (edgeCaseResponse !== null) {
            setMessages((prevMessages) => [...prevMessages, { text: edgeCaseResponse, type: 'ai' }]);
            return;
        }

        setLastUserQuery(message);

        setResponseLoading(true);

        try {
            const response = await fetch('https://taxqueryai.onrender.com/api/get_response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: message })
            });

            const data = await response.json();
            setResponseLoading(false);
            const aiResponse = data.response || "Sorry, I couldn't understand the question.";

            setMessages((prevMessages) => [...prevMessages, { text: aiResponse, type: 'ai' }]);

        } catch (error) {
            console.error("Error fetching response:", error);
            setResponseLoading(false);
            setMessages((prevMessages) => [...prevMessages, { text: "I couldn't find anything related to that. Can you please rephrase your query?", type: 'ai' }]);
        }
    };

    return (
        <div className='w-full h-full flex flex-col items-center relative'>
            <div
                className="w-full flex-1 overflow-auto flex justify-center mt-4 px-4 md:px-5"
                style={{ paddingBottom: `${queryBoxHeight + 20}px` }}
            >
                <div className={`${isMobile ? 'w-full' : 'w-[70%]'} ${(isAIVisible && isMobile) && 'hidden'} h-full`}>
                    <MessageContainer
                        ref={messagesEndRef}
                        messages={messages}
                        loading={responseLoading}
                        messagesType={1}
                    />
                </div>
                <AnimatePresence>
                    {isAIVisible && (
                        <motion.div
                            className={`${isMobile ? "w-full" : "w-[30%] ml-[10px]"} h-full`}
                            initial={{ scale: 0, originX: 1, originY: 1 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, originX: 1, originY: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <AIChatBot
                                onSendMessage={handleUserMessage}
                                messages={messages}
                                loading={responseLoading}
                                toggleAIVisibility={toggleAIVisibility}
                                isMobile={isMobile}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {
                ((!isAIVisible && isMobile) || !isMobile) ?
                    <>
                        <div className="absolute bottom-3 w-full flex justify-center">
                            <div ref={queryBoxRef} className="w-full px-4 pr-24 md:w-3/5 md:px-0">
                                <QueryTextBox
                                    placeholder="Ask Query"
                                    type={1}
                                    onSendMessage={handleUserMessage}
                                />
                            </div>
                        </div>
                        <div className='absolute right-4 md:right-5 bottom-3'>
                            <Tooltip text="Ask AI" position='left'>
                                <div
                                    className='w-16 h-16 text-[35px] flex items-center justify-center rounded-full bg-zinc-900 text-white hover:text-primaryAccent transition ease-in-out delay-75 cursor-pointer'
                                    onClick={toggleAIVisibility}
                                >
                                    <SiHelpscout />
                                </div>
                            </Tooltip>
                        </div>
                    </> :
                    <div className="absolute left-4 right-4 bottom-3 h-16 flex items-center justify-center px-4 rounded-lg bg-zinc-900 text-white font-bold select-none cursor-pointer" onClick={toggleAIVisibility}>
                        Close ChatBot
                    </div>
            }
        </div>
    )
}

export default Interact;