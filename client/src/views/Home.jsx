import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext'

import CustomerHome from '../components/CustomerHome'
import BusinessHome from '../components/BusinessHome'
import BookingService from '../services/booking'

const Home = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [query, setQuery] = useState('')
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        if (!user){
            navigate('/')
        }
        async function fetchData() {
            const b = await BookingService.getBookings()
            setBookings(b)
        }
        fetchData()
    }, []);

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    }

    const onClickDelete = async (bookingId) => {
        
    }

    const onClickEdit = (bookingId) => {
        return (
            navigate(`/edit/${bookingId}`)
        )
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
            <BusinessHome
                user={user}
                bookings={bookings}
                onClickDelete={{onClickDelete}}
                onClickEdit={onClickEdit}
            />
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
                <Navigate to="/" />
            )}
        </div>
    )
}

export default Home