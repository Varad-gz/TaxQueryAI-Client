'use client'

import React, { useState, useRef, useEffect } from 'react'

import QueryTextBox from '@/components/QueryTextBox';
import MessageContainer from '@/components/MessageContainer';
import AIChatBot from '@/components/AIChatBot';

const Interact = () => {

  const [queryBoxHeight, setQueryBoxHeight] = useState(44);
  const [isAIVisible, setIsAIVisible] = useState(false);
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

  return (
    <div className='w-full h-screen flex flex-col items-center'>
      <div className='my-[10px] text-[20px] flex flex-col items-center'>
        <div>TaxQueryAI <span className='text-gray-500'>{'(MySQL Database Q&A Tool)'}</span></div>
        <div className='text-[15px]'>As per 2013-18</div>
      </div>
      <div className="w-full flex-1 overflow-auto flex justify-center px-[20px]" style={{ paddingBottom: `${queryBoxHeight + 20}px` }}>
        <MessageContainer />
        {isAIVisible && <AIChatBot />}
      </div>
      <div ref={queryBoxRef} className="absolute w-[60%] px-[20px] bottom-[10px]">
        <QueryTextBox placeholder="Ask your question" type={1} toggleAIVisibility={toggleAIVisibility} />
      </div>
    </div>
  )
}

export default Interact
