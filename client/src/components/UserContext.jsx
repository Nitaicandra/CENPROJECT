import React, { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

import loginServ from '../services/login'

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedInUser');

        const fetchData = async () => {
            try {
                if (loggedUserJSON) {
                    const user = JSON.parse(loggedUserJSON);
                    setUser(user);

                    const acc = await loginServ.getAccount();
                    setAccount(acc);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
        <UserContext.Provider value={{ user, account, loginUser, logoutUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};