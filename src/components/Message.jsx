import React from 'react'

import { MdRealEstateAgent } from "react-icons/md";

const Message = ({ type, children }) => {

    // const mainDivStyle = type === 1 ? 'bg-[#121212]' : 'bg-[#1a1a1a] ml-auto';
    // const pointDivStyle = type === 1 ? 'bg-[#121212]' : 'bg-[#1a1a1a] right-[10px]';
    // const mainDivStyle = type === 1 ? 'bg-gray-300' : 'bg-gray-200 ml-auto';
    // const pointDivStyle = type === 1 ? 'bg-gray-300' : 'bg-gray-200 right-[10px]';
    // const clipPathStyle = type === 1 ? 'polygon(0% 100%, 100% 0%, 0% 0%)' : 'polygon(0% 0%, 100% 100%, 100% 0%)';

    // return (
    //     <div className={`w-fit max-w-[60%] my-[20px] relative p-[10px] rounded-md text-[18px] text-gray-700 break-words ${mainDivStyle}`} >
    //         <p>{children}</p>
    //         <div className={`absolute top-full w-[20px] h-[20px] ${pointDivStyle}`} style={{ clipPath: clipPathStyle }}></div>
    //     </div >
    // )

    const mainDivStyle = type === 1 ? 'border-t-[2px] border-b-[2px] border-[#EFEFEF] text-zinc-600' : 'bg-primaryAccent text-white rounded-sm';

    return (
        <div className={`w-full mt-[20px] p-[20px] ${mainDivStyle}`} >
            {
                type === 1 &&
                <div className='mb-[10px] flex items-center'>
                    <div className='border-[2px] border-[#EFEFEF] p-[5px] rounded-full w-fit'>
                        <MdRealEstateAgent className='text-[30px] text-primaryAccent' />
                    </div>
                    <div className='text-[20px] font-bold ml-[5px]'>TQAI</div>
                </div>
            }
            <p className='text-[15px] font-semibold break-words'>{children}</p>
        </div >
    )
}

export default Message
