'use client'

import React, { useState, useRef, useEffect } from 'react'
import QueryTextBox from '@/components/QueryTextBox';
import MessageContainer from '@/components/MessageContainer';
import AIChatBot from '@/components/AIChatBot';

const Interact = () => {
  const [queryBoxHeight, setQueryBoxHeight] = useState(44);
  const [isAIVisible, setIsAIVisible] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [lastUserQuery, setLastUserQuery] = useState(null);
  const queryBoxRef = useRef(null);

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

  const toggleAIVisibility = () => {
    setIsAIVisible((prev) => !prev);
  };

  const getSQLQuery = async (previousQuery) => {
    if (!previousQuery) return "I couldn't find a previous query to generate SQL for.";
  
    try {
      const response = await fetch('http://127.0.0.1:3000/api/get_sql_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: previousQuery, last_response: messages[messages.length - 1]?.text }) // Send last AI response
      });
  
      const data = await response.json();
      return data.sql_query || "Couldn't generate SQL for the last query.";
    } catch (error) {
      console.error("Error fetching SQL query:", error);
      return "An error occurred while fetching the SQL query.";
    }
  };
  
  const breakdown = async (previousQuery) => {
    if (!previousQuery) return "I couldn't find a previous query to provide a breakdown.";
  
    try {
      const response = await fetch('http://127.0.0.1:3000/api/get_breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: previousQuery, last_response: messages[messages.length - 1]?.text })
      });
  
      const data = await response.json();
      return data.breakdown || "Couldn't provide a breakdown for the last query.";
    } catch (error) {
      console.error("Error fetching breakdown:", error);
      return "An error occurred while fetching the breakdown.";
    }
  };
  
  const handleEdgeCases = async (userQuery) => {
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
      • What was the total property tax collection in 2013-14 residential for Aundh in Pune city?
      • What was the property efficiency for the year 2015-16 commercial for Chennai?
      • What was the collection gap for the year 2016-17 residential for Thanjavur?
      • What was the collection gap for Solapur from 2013-18 residential?
      • What will be the tax demand for the year 2025 in Pune for residential?
      • What will be the property efficiency (residential) for the year 2019 in Pune?
    `;
    }
    if (goodbyeMessages.has(userQuery)) return "Goodbye! Catch you later.";

    return null; 
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return; 

    setMessages((prevMessages) => [...prevMessages, { text: message, type: 'user' }]);

    const edgeCaseResponse = await handleEdgeCases(message);
    if (edgeCaseResponse !== null) {  
      setMessages((prevMessages) => [...prevMessages, { text: edgeCaseResponse, type: 'ai' }]);
      return;  
    }

    setLastUserQuery(message);

    try {
      const response = await fetch('http://127.0.0.1:3000/api/get_response', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }) 
      });

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I couldn't understand the question.";

      setMessages((prevMessages) => [...prevMessages, { text: aiResponse, type: 'ai' }]);
    } catch (error) {
      // console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "I couldn't find anything related to that. Can you please rephrase your query?", type: 'ai' }]);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col items-center'>
      <div className='my-[10px] text-[20px] flex flex-col items-center'>
        <div>TaxQueryAI <span className='text-gray-500'>{'(MySQL Database Q&A Tool)'}</span></div>
        <div className='text-[15px]'>As per 2013-18</div>
      </div>
      <div className="w-full flex-1 overflow-auto flex justify-center px-[20px]" style={{ paddingBottom: `${queryBoxHeight + 20}px` }}>
        <MessageContainer messages={messages} />  {}
        {isAIVisible && <AIChatBot onSendMessage={handleUserMessage} />}
      </div>
      <div ref={queryBoxRef} className="absolute w-[60%] px-[20px] bottom-[10px]">
        <QueryTextBox 
          placeholder="Start by asking: What are the possible questions I can ask?" 
          type={1} 
          toggleAIVisibility={toggleAIVisibility} 
          onSendMessage={handleUserMessage} 
        />
      </div>
    </div>
  )
}

export default Interact;
