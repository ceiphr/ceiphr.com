import { createContext, useState } from 'react';

export interface FetchError extends Error {
    name: string;
    message: string;
    stack?: string;
}

export const ErrorContext = createContext({
    error: null,
    handleError: (error: any) => {}
});

export function ErrorProvider({ children }: any) {
    const [error, setError] = useState(null);

    const handleError = (error: any) => {
        setError(error);
        setTimeout(() => setError(null), 5000);
    };

    return (
        <ErrorContext.Provider value={{ error, handleError }}>
            {children}
        </ErrorContext.Provider>
    );
}
