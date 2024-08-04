import React, { useState, useContext } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router-dom'

import bookingService from '../services/booking'
import Alert from '../components/Alert'
import { UserContext } from '../components/UserContext'

const EditBookingForm = () => {
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    const [discount, setDiscount] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const { bookingId } = useParams()
    const { user, loading } = useContext(UserContext)
    const navigate = useNavigate()

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || user.type !== 'business') {
        return <Navigate to="/" />;
    }

    const handleTimeChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;

        if (name == 'start') {
            setStartTime(value)
        } else {
            setEndTime(value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try{
            await bookingService.editBooking({discount, startTime, endTime}, bookingId)
            setAlertMessage('Booking was successfully modified')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
                navigate('/home')
            }, 3000)

        } catch (exception){
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }

    return (
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
            <main>
            <Alert message={alertMessage} type={alertType} />
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Modify Booking</h2>

                                <div className="sm:col-span-2">
                                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                        Select a Discount %
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <select
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="any"
                                                value={discount}
                                                onChange={({ target }) => setDiscount(target.value)}

                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            >
                                                <option> </option>
                                                <option>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>25</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                                <option>45</option>
                                                <option>50</option>
                                                <option>55</option>
                                                <option>60</option>
                                                <option>65</option>
                                                <option>70</option>
                                                <option>75</option>
                                                <option>80</option>
                                                <option>85</option>
                                                <option>90</option>
                                                <option>95</option>
                                                <option>100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* Set Time */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="w-full max-w-[7rem]">
                                    <label htmlFor="start-time-sunday" className="text-sm">Start time:</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="time" id="start-time-sunday" name="start" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={startTime}
                                            onChange={handleTimeChange}
                                        />
                                    </div>
                                </div>
                                <div className="w-full max-w-[7rem]">
                                    <label htmlFor="end-time-sunday" className="text-sm">End time:</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="time" id="end-time-sunday" name="end" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={endTime}
                                            onChange={handleTimeChange}

                                        />
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
                </div>
            </main >
        </div >

    )
}

export default EditBookingForm