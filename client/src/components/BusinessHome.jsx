const BusinessHome = ({
    user,
    onClickDelete,
    onClickEdit,
    onClickNewService,
    bookings
}) => {
    return (
        <div className="min-h-full">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, <span>&nbsp; </span> {user.username}</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <button
                        className="mr-10 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onClickNewService}>
                        Create A New Service
                    </button>
                    <h2 className="mt-9 text-base font-semibold leading-7 text-gray-900" >Your Upcoming Bookings </h2>
                    <div className="flex flex-wrap gap-3">
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div key={index} className="my-5 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{booking.date} </h5>

                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Time: from {booking.startTime} to {booking.endTime} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Service: {booking.service.serviceName} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Customer: {booking.customer.firstName} {booking.customer.lastName} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Price: $ {booking.price.$numberDecimal} </p>
                                    <button
                                        className="mr-10 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-neutral-950"
                                        onClick={() => onClickDelete(booking._id)}>
                                        Delete
                                    </button>
                                    <button
                                        className="mr-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => onClickEdit(booking._id)}>
                                        Edit
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p> No upcoming bookings :( </p>
                        )}
                    </div>
                </div>
            </main >
        </div >
    )
}

export default BusinessHome