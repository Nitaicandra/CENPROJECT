import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext'

import CustomerHome from '../components/CustomerHome'
import BusinessHome from '../components/BusinessHome'
import BookingService from '../services/booking'
import Alert from '../components/Alert'

const Home = () => {
    const { user, loading } = useContext(UserContext)
    const navigate = useNavigate()

    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    const [query, setQuery] = useState('')
    const [bookings, setBookings] = useState([])
    const [bookingsToReview, setBookingsToReview] = useState([])

    useEffect(() => {
        if (loading) { return }

        if (!user){
            navigate('/')
            return
        }
        async function fetchData() {
            const b = await BookingService.getBookings()
            setBookings(b)

            const pastBookings = await BookingService.getpastBookings()
            const filtered = pastBookings.filter(booking => !booking.review)
            setBookingsToReview(filtered)
        }
        fetchData()
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || user.type === 'admin') {
        return <Navigate to="/" />
    }

    const handleSearch = () => {
        if (query.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    }

    const onClickDelete = async (bookingId) => {
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

    const onClickReview = (bookingId) => {
        return (
            navigate(`/review/${bookingId}`)
        )
    }

    const onClickNewService = () => {
        return(
            navigate('/create-service')
        )
    }

    const Customer = () => {
        return (
            <CustomerHome
                user={user}
                handleQueryChange={({ target }) => setQuery(target.value)}
                handleSearch={handleSearch}
                bookings={bookings}
                bookingsToReview={bookingsToReview}
                onClickReview={onClickReview}
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
                onClickNewService={onClickNewService}
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