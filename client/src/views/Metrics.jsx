import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

import { UserContext } from '../components/UserContext'

import BusinessServ from '../services/business'
import BookingServ from '../services/booking'
import ReviewServ from '../services/review'

const Metrics = () => {
    const { user, account, loading: userLoading } = useContext(UserContext)
    const navigate = useNavigate()

    const [business, setBusiness] = useState(null)
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(null)

    useEffect(() => {
        if (userLoading) { return }

        if (!user || !account || user.type !== 'business') {
            navigate('/')
            return
        }
        async function fetchData() {
            try {
                const b = await BusinessServ.getBusiness(account.id)
                setBusiness(b)

                const pastBookings = await BookingServ.getpastBookings()
                setBookings(pastBookings)

                const r = await ReviewServ.getRating(account.id)
                setRating(r)

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userLoading, user, account, navigate])

    if (userLoading || loading) {
        return <div>Loading...</div>
    }

    if (!user || !account || user.type !== 'business') {
        return <Navigate to="/" />
    }

    const totalEarnings = bookings.reduce((total, booking) => total + parseFloat(booking.price.$numberDecimal), 0)

    return (
        <>
            <div className="min-h-full">
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Business Metrics</h1>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            See what you have accomplished so far in LocalPro Connect!
                        </p>
                    </div>
                    
                </header>
                {bookings && business && business.services && (
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Services</h2>
                            <p>You are offering <b>{business.services.length}</b> services in the app</p>
                            {business.services.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {business.services.map((service, index) => (
                                        <div key={index}>
                                            <p className="font-normal text-gray-700 dark:text-gray-400">{service.serviceName}</p>
                                        </div>
                                    ))}
                                </ul>
                            ) : ('')}
                        </div>

                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Bookings</h2>
                            <p>You have {business.bookings.length} bookings so far</p>
                            {bookings.length > 0 ? (
                                <p> And you have made <b>${totalEarnings} </b> in total with completed appointments. Good Job!</p>
                            ) : ('')}
                        </div>

                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Reviews</h2>
                            <p>You have received <b> {rating.reviewCount} </b> reviews so far and have an average score rating of <b> {rating.averageRating} </b></p>

                        </div>
                    </main>
                )}
            </div>
        </>
    )
}

export default Metrics