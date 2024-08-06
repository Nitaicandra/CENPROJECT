import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import { UserContext } from '../components/UserContext'
import businessServ from '../services/business'
import reviewServ from '../services/review'

const BusinessProfile = () => {
    const { user, account, loading: userLoading } = useContext(UserContext)
    const { businessId } = useParams()
    const navigate = useNavigate()

    const [business, setBusiness] = useState('')
    const [businessHours, setBusinessHours] = useState([])
    const [loading, setLoading] = useState(true)
    const [reply, setReply] = useState('')
    const [rating, setRating] = useState(null)

    useEffect(() => {
        if (userLoading) { return }

        if (!user || !account) {
            navigate('/')
            return
        }
        async function fetchData() {
            let b = await businessServ.getBusiness(businessId)
            setBusiness(b)

            if (b.availability.length >= 1) {
                const parsedAvailability = JSON.parse(b.availability[0])
                setBusinessHours(parsedAvailability)
            }

            const r = await reviewServ.getRating(businessId)
            setRating(r)

            setLoading(false);
        }

        fetchData()

    }, [businessId, userLoading, user])

    const onClickDetails = (serviceId) => {
        navigate(`/service/${serviceId}`)
    }
    const Star = () => (
        <svg className="w-5 h-5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
    )

    const Rating = ({ rating }) => {
        return (
            <div className="flex items-center mb-4 text-yellow-300">
                {Array.from({ length: rating }, (_, index) => (
                    <Star key={index} />
                ))}
            </div>
        )
    }

    const handleSubmitReply = async (reviewId, event) => {
        try {
            await reviewServ.reply({ reply }, reviewId)
            setReply('')
            //navigate(`/business/${businessId}`)
        } catch (exception) {
            console.log(exception.response.data.error)
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    const roundedAvgRating = rating ? Math.round(rating.averageRating) : 0;

    return (
        <>
            {business ? (
                <div className="min-h-full">
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{business.businessName}</h1>

                            {roundedAvgRating !== 0 ? (
                                <div className='mt-4 flex'>
                                    <Rating rating={roundedAvgRating} /> <span>{rating.averageRating}</span>
                                </div>
                            ) : ('')}
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Business Information</h2><br></br>
                            <div className="col-span-full text-base">
                                <b>Location: </b> {business.address}, {business.city} - {business.state} <br></br>
                                <b>Email: </b> <a href='mailto:${business.email}'>{business.email}</a><br></br>
                                <b>Phone: </b> {business.phoneNumber} <br></br>
                                <br></br>
                                <b>Business Hours:</b>
                                <ul>
                                    {businessHours.length > 0 ? (
                                        businessHours.map((day, index) => {
                                            const dayName = Object.keys(day)[0];
                                            const times = day[dayName];
                                            return (
                                                <li key={index}>
                                                    {dayName}:{" "}
                                                    {times.map((timeSlot, i) => (
                                                        <span key={i}>
                                                            {timeSlot.start} - {timeSlot.end}{" "}
                                                        </span>
                                                    ))}
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <li>No availability information</li>
                                    )}
                                </ul>
                            </div>
                            <h2 className="mt-9 text-base font-semibold leading-7 text-gray-900" >Services </h2>
                            <div className="flex flex-wrap gap-3">
                                {business.services.length > 0 ? (
                                    business.services.map((service, index) => (
                                        <div key={index} className="my-5 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{service.serviceName} </h5>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Description: {service.description}</p>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Price: {service.price.$numberDecimal} </p>
                                            {user.type === 'customer' ? (
                                                <button
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={() => onClickDetails(service.id)}>
                                                    View Details
                                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                    </svg>
                                                </button>
                                            ) : ('')}
                                        </div>
                                    ))
                                ) : (
                                    <p> This business offers no services yet :( </p>
                                )}
                            </div>
                            <h2 className="mt-9 text-base font-semibold leading-7 text-gray-900" > Reviews </h2><br></br>
                            <div className="">
                                {business.reviews.length > 0 ? (
                                    business.reviews.map((review, index) => (
                                        <div key={index}>
                                            <figure className="max-w-screen-md">
                                                <Rating rating={review.rating} />
                                                <blockquote>
                                                    <p className="text-2xl text-gray-900 dark:text-white">
                                                        "{review.review}"
                                                    </p>
                                                </blockquote>
                                                <figcaption className="flex items-center mt-6 space-x-3 rtl:space-x-reverse">
                                                    <div className="flex items-center divide-x-2 rtl:divide-x-reverse divide-gray-300 dark:divide-gray-700">
                                                        <cite className="pe-3 font-medium text-gray-900 dark:text-white">
                                                            {review.customer.firstName} {review.customer.lastName}
                                                        </cite>
                                                    </div>
                                                </figcaption>
                                            </figure>
                                            {review.reply ? (
                                                <p> {business.businessName}: {review.reply}</p>
                                            ) : (
                                                user && business && user.id === business.login && (
                                                    <form onSubmit={(event) => handleSubmitReply(review._id, event)}>
                                                        <label htmlFor="reply" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Reply to this review
                                                        </label>
                                                        <div className="mt-2">
                                                            <textarea
                                                                id="description"
                                                                name="description"
                                                                rows={2}
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                value={reply}
                                                                onChange={({ target }) => setReply(target.value)}
                                                                required
                                                            />
                                                        </div><br></br>
                                                        <button
                                                            type="submit"
                                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                        >
                                                            Submit
                                                        </button>
                                                    </form>
                                                ))}
                                            <div className="border-b border-gray-900/10 pb-12"></div>
                                            <br></br>
                                        </div>))
                                ) : (
                                    <p> This business has no reviews yet :( </p>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            ) : ('')}
        </>
    )
}

export default BusinessProfile
