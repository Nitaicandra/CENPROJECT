import  React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

const Home = () => {
    const { user } = useContext(UserContext);

    return(
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
            This is the home page :D <br />
            {user ? (
                <div>Welcome, {user.username}</div>
            ) : (
                <div>No user logged in</div>
            )}
        </div>
    )
}

export default Home