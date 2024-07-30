import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedInUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
        }
    }, []);

    const loginUser = (userData) => {
        window.localStorage.setItem('loggedInUser', JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        window.localStorage.removeItem('loggedInUser');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};