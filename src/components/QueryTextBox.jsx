'use client'

import React, { useState, useRef } from 'react'

import Tooltip from './Tooltop';

import { LuSendHorizontal } from "react-icons/lu";
import { FaBolt } from "react-icons/fa";


const QueryTextBox = ({ placeholder, type, toggleAIVisibility, onSendMessage }) => {
    const [inputText, setInputText] = useState("");
    const textareaRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleChange = (e) => {
        setInputText(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; 
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                (5 * 24) + 20 
            )}px`;
        }

        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    };

    const sendMessage = () => {
        if (inputText.trim().length === 0) return;

        onSendMessage(inputText);
        setInputText(""); 
    };

    return (
        <div className={`w-full flex flex-row ${type === 2 && 'text-white'}`}>
            <div className={`w-full p-[10px] rounded-l-lg ${type === 1 ? 'bg-gray-200 border-[1px] border-gray-400 border-r-0' : 'bg-[#2D2D2D]'}`}>
                <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={handleChange}
                    rows={1}
                    className={`w-full p-[10px] outline-none resize-none overflow-y-auto text-[16px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 ${type === 1 ? 'bg-gray-200' : 'bg-[#2D2D2D]'}`}
                    style={{ lineHeight: "24px", maxHeight: "140px" }} // 20 for padding, 120 total line size
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div 
                className={`w-fit px-[20px] flex-shrink-0 flex items-center justify-center text-[25px] ${type === 1 ? 'bg-gray-200 border-gray-400 border-t-[1px] border-b-[1px]' : 'rounded-r-lg bg-[#2D2D2D]'}`}
                onClick={sendMessage}
            >
                <Tooltip text="Send" pos={1}>
                    <LuSendHorizontal className='hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 cursor-pointer' />
                </Tooltip>
            </div>
            {type === 1 && (
                <div className='w-fit px-[20px] flex-shrink-0 flex items-center justify-center text-[25px] bg-gray-200 border-[1px] border-gray-400 rounded-lg rounded-l-none border-l-0'>
                    <Tooltip text="Ask AI" pos={1}>
                        <FaBolt className='hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 cursor-pointer' onClick={toggleAIVisibility} />
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default QueryTextBox;