import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateBookingForm = ({
    date,
    startTime,
    endTime,
    service,
    businessHours,
    handleTimeChange,
    handleDateChange,
    handleSubmit
}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Service Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Check the details of your selected service before booking.
                        </p>

                        {service.provider &&
                        <div className="mt-5 text-base text-gray-900">
                            <b>Service:</b> {service.serviceName} <br></br>
                            <b>Provider:</b> {service.provider.businessName} <br></br>
                            <b>Price:</b> ${service.price.$numberDecimal} <br></br><br></br>
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
                        }
                    </div>


                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Booking </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Please be mindful of the business hours mentioned above.
                        </p>
                        <br></br>

                        <label htmlFor="date" className="text-sm">Select a date:</label>
                        <div className="mb-6">
                            < DatePicker
                                selected={date}
                                onChange={handleDateChange}
                                minDate={moment().toDate()}
                            />
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
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Book
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateBookingForm