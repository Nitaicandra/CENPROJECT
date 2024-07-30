import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';

import CustomerHome from '../components/CustomerHome';

const Home = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    }

    const Customer = () => {
        console.log(JSON.stringify(user))
        return (
            <CustomerHome
                user={user}
                handleQueryChange={({ target }) => setQuery(target.value)}
                handleSearch={handleSearch}
            />
        )
    }

    const Business = () => {
        return (
            ""
        )
    }

    return (
        <div className="">
            {user ? (
                user.type === 'customer' ? (
                    Customer()
                ) : (
                    Business()
                )           
            ) : (
                <div>No user logged in</div>
            )}
        </div>
    )
}

export default Home