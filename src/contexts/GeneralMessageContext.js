'use client';
import { createContext, useContext, useState } from 'react';

const GeneralMessageContext = createContext();

export function GeneralMessageProvider({ children }) {
    const [generalMessages, setGeneralMessages] = useState([]);

    return (
        <GeneralMessageContext.Provider value={{ generalMessages, setGeneralMessages }}>
            {children}
        </GeneralMessageContext.Provider>
    );
}

export const useGeneralMessages = () => useContext(GeneralMessageContext);
