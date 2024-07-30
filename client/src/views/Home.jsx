import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext'

import CustomerHome from '../components/CustomerHome'
import BookingService from '../services/booking'

const Home = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        async function fetchData() {
            let b = await BookingService.getCustomerBookings()
            setBookings(b)
        }
        fetchData()
    }, []);

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    }

    const Customer = () => {
        return (
            <CustomerHome
                user={user}
                handleQueryChange={({ target }) => setQuery(target.value)}
                handleSearch={handleSearch}
                bookings={bookings}
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