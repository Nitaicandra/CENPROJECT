import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext'

import CustomerHome from '../components/CustomerHome'
import BusinessHome from '../components/BusinessHome'
import BookingService from '../services/booking'
import Alert from '../components/Alert'

const Home = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

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
        //event.preventDefault()
        try{
            await BookingService.deleteBooking(bookingId)
            setAlertMessage('Booking has been deleted')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
                window.location.reload();
            }, 1000)
        } catch (exception) {
            setAlertMessage('Error: Wrong credentials')
            setAlertType('alert-error')
            setTimeout(() => {
              setAlertMessage(null)
            }, 5000)
        }
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
                onClickDelete={onClickDelete}
                onClickEdit={onClickEdit}
            />
        )
    }

    return (
        <div className="">
            <Alert message={alertMessage} type={alertType} />
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