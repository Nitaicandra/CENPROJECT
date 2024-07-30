const CustomerHome = ({
    user,
    query,
    handleQueryChange,
    handleSearch,
    bookings
}) => {
    return (
        <>
            <div className="min-h-full">
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, <span>&nbsp; </span> {user.username}</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <center><h2 className="mb-2 text-base font-semibold leading-7 text-gray-900" >Search for services near you</h2></center>

                        <form onSubmit={handleSearch} className="max-w-md mx-auto">
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="plumbing, lawn care, woodworking..."
                                    value={query}
                                    onChange={handleQueryChange}
                                    required />
                                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>

                        <h2 className="mt-9 text-base font-semibold leading-7 text-gray-900" >Your Upcoming Bookings </h2>
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div key={index} className="my-5 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{booking.date} </h5>

                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Time: from {booking.startTime} to {booking.endTime} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Service: {booking.service.serviceName} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Provider: {booking.provider.businessName} </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Price: $ {booking.price.$numberDecimal} </p>
                                </div>
                            ))
                        ) : (
                            <p> No upcoming bookings :( </p>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

export default CustomerHome
