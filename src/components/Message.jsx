import React from 'react';
import ReactMarkdown from 'react-markdown';

import { MdRealEstateAgent } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";

import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Message = ({ type, children, isFirst }) => {

    const baseStyleTypes = {
        1: 'bg-primaryAccent text-white rounded-sm w-full text-base px-5 py-5',
        2: 'border-t-2 border-b-2 border-[#EFEFEF] text-zinc-600 w-full text-base px-5 py-5',
        3: 'bg-primaryAccent text-white rounded-lg rounded-br-none w-fit ml-auto text-sm px-2.5 py-2.5',
        4: 'text-gray-600 mr-auto text-sm px-2.5 py-2.5',
        default: 'bg-primaryAccent text-white rounded-sm text-sm'
    };

    const styleTypes = {
        1: `${baseStyleTypes[1]} ${isFirst ? '' : 'mt-5'}`,
        2: `${baseStyleTypes[2]} ${isFirst ? '' : 'mt-5'}`,
        3: `${baseStyleTypes[3]} ${isFirst ? '' : 'mt-2.5'}`,
        4: `${baseStyleTypes[4]} ${isFirst ? '' : 'mt-2.5'}`,
        default: baseStyleTypes.default
    };

    const mainDivStyle = styleTypes[type] || styleTypes.default;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(children).then(() => {
            toast.success('Text copied to clipboard')
        }).catch(err => {
            toast.error('Failed to copy text: ', err);
        });
    };

    return (
        <motion.div
            className={`${mainDivStyle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {type === 2 && (
                <div className='mb-[10px] flex items-center'>
                    <div className='border-[2px] border-[#EFEFEF] p-[5px] rounded-full w-fit'>
                        <MdRealEstateAgent className='text-[30px] text-primaryAccent' />
                    </div>
                    <div className='text-[20px] font-bold ml-[5px]'>TQAI</div>
                </div>
            )}

            {/* Wrap ReactMarkdown in a div and apply styling there */}
            <div className='font-semibold'>
                <ReactMarkdown
                    components={{
                        pre: ({ node, ...props }) => (
                            <pre className="whitespace-pre-wrap overflow-auto" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                            <code className="whitespace-pre-wrap overflow-auto bg-gray-200" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                            <li className="break-all ml-6" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                            <ul className="list-disc break-all pl-4" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="list-decimal break-all pl-4" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                            <p className="whitespace-normal break-all" {...props} />
                        ),
                    }}
                >
                    {children}
                </ReactMarkdown>
            </div>
            <button onClick={handleCopyToClipboard} className="mt-3 cursor-pointer">
                <MdContentCopy />
            </button>
        </motion.div >
    );
}

export default Message;
