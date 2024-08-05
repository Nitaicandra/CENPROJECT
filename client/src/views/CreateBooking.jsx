import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import CreateBookingForm from '../components/CreateBookingForm'
import Alert from '../components/Alert'

import serviceServ from '../services/service'
import bookingService from '../services/booking'

const CreateBooking = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams();

    const [alertType, setAlertType] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)

    const [bookingDate, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [service, setService] = useState({})
    const [businessHours, setBusinessHours] = useState([])

    useEffect(() => {
        async function fetchData() {
            let s = await serviceServ.getService(serviceId)
            setService(s)

            if (s.provider.availability.length >= 1) {
                const parsedAvailability = JSON.parse(s.provider.availability[0])
                setBusinessHours(parsedAvailability)
                console.log(parsedAvailability)
            }

            console.log(s)
        }

        fetchData()

    }, [serviceId])

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

        try{
            await bookingService.createBooking({date, weekDay, startTime, endTime}, serviceId)
            setAlertMessage('Booking was successfully created')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
            }, 5000)
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
