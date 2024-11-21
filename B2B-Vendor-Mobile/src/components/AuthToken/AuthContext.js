import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const updateToken = (newToken) => {
        console.log("llllllllllll newToken Here :", newToken);
        setToken(newToken);
    };

    const clearToken = () => {
        console.log("llllllllllll clearToken Here :");

        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, updateToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
