import React from 'react';

import Message from '@/components/Message';

const MessageContainer = () => {
    return (
        <div className='max-w-[60%] flex flex-col items-center overflow-scroll overflow-x-hidden scrollbar-none mt-[-20px]'>
            <Message>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
            <Message type={1}>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
            <Message>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
            <Message type={1}>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
            <Message type={1}>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
            <Message type={1}>dadasdaas dsafsafas dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</Message>
        </div>
    )
}

export default MessageContainer
