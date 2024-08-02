import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'

import { UserContext } from '../components/UserContext'
import Alert from '../components/Alert'
import BookingServ from '../services/booking'
import ReviewServ from '../services/review'

const ReviewForm = () => {
    const navigate = useNavigate()
    const { bookingId } = useParams()
    const { user, loading } = useContext(UserContext)

    const [alertType, setAlertType] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)

    const [booking, setBooking] = useState({})
    const [rating, setRating] = useState(1)
    const [review, setReview] = useState('')

    useEffect(() => {
        if (loading) {return}

        if (!user){
            navigate('/')
            return
        }
        async function fetchData() {
            const b = await BookingServ.getBooking(bookingId)
            setBooking(b)
        }
        fetchData()
    }, [bookingId, user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await ReviewServ.review({ rating, review }, bookingId)
            setAlertMessage('Review was successfully posted')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
                navigate('/home')
            }, 2000)
        } catch (exception) {
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Alert message={alertMessage} type={alertType} />
            {booking ? (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Review</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Tell us about your experience with <b>{booking.provider?.businessName || ''}</b> on {booking.date}
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-1">
                                    <label htmlFor="rating" className="block text-sm font-medium leading-6 text-gray-900">
                                        Rate you provider
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="rating"
                                            type="range"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={rating}
                                            onChange={({ target }) => setRating(target.value)}
                                            required
                                            className="block w-full  py-1.5 text-gray-900 sm:max-w-xs sm:text-sm sm:leading-6"
                                        />
                                        {rating}
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="review" className="block text-sm font-medium leading-6 text-gray-900">
                                        Write a review
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="review"
                                            name="review"
                                            rows={3}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            value={review}
                                            onChange={({ target }) => setReview(target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            ) : ('')}
        </div>
    )
}

export default ReviewForm