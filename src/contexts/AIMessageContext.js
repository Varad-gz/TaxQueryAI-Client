'use client';
import { createContext, useContext, useState } from 'react';

const AIMessageContext = createContext();

export function AIMessageProvider({ children }) {
    const [aiMessages, setAIMessages] = useState([]);

    return (
        <AIMessageContext.Provider value={{ aiMessages, setAIMessages }}>
            {children}
        </AIMessageContext.Provider>
    );
}

export const useAIMessages = () => useContext(AIMessageContext);
