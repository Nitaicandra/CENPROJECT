import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import SearchService from '../services/search'
import Alert from '../components/Alert'

const Search = () => {
    const location = useLocation();

    const [results, setResults] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('query');

        if (query) {
            fetchSearchResults(query);
        }
    }, [location]);

    const fetchSearchResults = async (query) => {
        try {
            const res = await SearchService.search(query)
            setResults(res)
        } catch (exception) {
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 5000)
        }
    }

    const onClickDetails = (serviceId) => {
        console.log(serviceId)
    }

    return (
        <div className="min-h-full">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Results </h1>
                </div>
            </header>
            <main>
                <Alert message={alertMessage} type={alertType} />

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <div key={index} className="my-5 max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{result.serviceName} by {result.businessName}</h5>

                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{result.distance} miles from you </p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Price: ${result.price} </p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{result.description} </p>
                                <button 
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => onClickDetails(result.serviceId)}>
                                    View Details
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No results found</p>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Search