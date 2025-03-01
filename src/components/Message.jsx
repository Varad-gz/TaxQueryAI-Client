import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MdRealEstateAgent } from "react-icons/md";

const Message = ({ type, children }) => {
    const mainDivStyle = type === 1 
        ? 'border-t-[2px] border-b-[2px] border-[#EFEFEF] text-zinc-600' 
        : 'bg-primaryAccent text-white rounded-sm';

    return (
        <div className={`w-full mt-[20px] p-[20px] ${mainDivStyle}`} >
            {type === 1 && (
                <div className='mb-[10px] flex items-center'>
                    <div className='border-[2px] border-[#EFEFEF] p-[5px] rounded-full w-fit'>
                        <MdRealEstateAgent className='text-[30px] text-primaryAccent' />
                    </div>
                    <div className='text-[20px] font-bold ml-[5px]'>TQAI</div>
                </div>
            )}

            {/* Wrap ReactMarkdown in a div and apply styling there */}
            <div className='text-[15px] font-semibold break-words'>
                <ReactMarkdown>
                    {children}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Message;
