'use client'

import React, { useState, useRef } from 'react'

import Tooltip from './Tooltop';
import { LuSendHorizontal } from "react-icons/lu";
import useIsMobile from '@/hooks/useIsMobile';


const QueryTextBox = ({ placeholder, type, onSendMessage }) => {
    const [inputText, setInputText] = useState("");

    const isMobile = useIsMobile();

    const textareaRef = useRef(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !isMobile) {
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

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }, 0);
    };

    return (
        <div className={`w-full flex flex-row`}>
            <div className={`w-full p-[10px] rounded-l-lg border-[1px] border-gray-200 border-r-0 bg-[#f9f9f9]`}>
                <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={handleChange}
                    rows={1}
                    className={`w-full p-[10px] outline-none resize-none overflow-y-auto text-[16px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-200 scrollbar-track-[#f9f9f9] bg-[#f9f9f9]`}
                    style={{ lineHeight: "24px", maxHeight: "140px" }} // 20 for padding, 120 total line size
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className={`w-fit px-[20px] flex-shrink-0 flex items-center justify-center text-[25px] bg-[#f9f9f9] border-[1px] border-gray-200 rounded-r-lg border-l-0`}>
                <Tooltip text="Send" position='top'>
                    <button onClick={sendMessage} className='hover:text-primaryAccent active:text-primaryAccent focus:text-primaryAccent outline-0 hover:scale-110 transition ease-in-out delay-75 cursor-pointer'>
                        <LuSendHorizontal />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default QueryTextBox;