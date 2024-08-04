import React, { useEffect, useState, useContext, } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import CreateBookingForm from '../components/CreateBookingForm'
import Alert from '../components/Alert'
import { UserContext } from '../components/UserContext'

import serviceServ from '../services/service'
import bookingService from '../services/booking'

const CreateBooking = () => {
    const { serviceId } = useParams()
    const navigate = useNavigate()
    const { user, loading: userLoading } = useContext(UserContext)

    const [alertType, setAlertType] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)
    const [loading, setLoading] = useState(true)

    const [bookingDate, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [service, setService] = useState({})
    const [businessHours, setBusinessHours] = useState([])

    useEffect(() => {
        if (userLoading) { return }

        if (!user || user.type !== 'customer') {
            navigate('/')
            return
        }

        async function fetchData() {
            try {
                let s = await serviceServ.getService(serviceId)
                setService(s)

                if (s.provider.availability.length >= 1) {
                    const parsedAvailability = JSON.parse(s.provider.availability[0])
                    setBusinessHours(parsedAvailability)
                    console.log(parsedAvailability)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [serviceId, user, userLoading])

    if (userLoading || loading) {
        return <div>Loading...</div>
    }

    if (!user || user.type !== 'customer') {
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

    const handleDateChange = (e) => {
        setDate(e)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const weekdays = {
            'Mon': 'Monday',
            'Tue': 'Tuesday',
            'Wed': 'Wednesday',
            'Thu': 'Thursday',
            'Fri': 'Friday',
            'Sat': 'Saturday',
            'Sun': 'Sunday'
        }

        const dateObject = new Date(bookingDate.toString())
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');

        const date = `${year}-${month}-${day}`;
        const weekDay = weekdays[bookingDate.toString().split(' ')[0]]

        try {
            await bookingService.createBooking({ date, weekDay, startTime, endTime }, serviceId)
            setAlertMessage('Booking was successfully created')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
            }, 5000)
        } catch (exception) {
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }


    return (
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
            <Alert message={alertMessage} type={alertType} />
            <CreateBookingForm
                date={bookingDate}
                startTime={startTime}
                endTime={endTime}
                service={service}
                businessHours={businessHours}

                handleDateChange={handleDateChange}
                handleTimeChange={handleTimeChange}

                handleSubmit={handleSubmit}
            />
        </div>
    )

}

export default CreateBooking
