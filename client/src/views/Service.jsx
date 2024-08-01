import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import serviceServ from '../services/service'

const Service = () => {
    const navigate = useNavigate()
    const { serviceId } = useParams()

    const [service, setService] = useState({})

    useEffect(() => {
        async function fetchData() {
            try {
                const s = await serviceServ.getService(serviceId)
                setService(s)
            } catch (exception) {
                console.error("Error fetching service: ", exception);
            }
        }

        fetchData()

    }, [serviceId])

    const onClickBook = () => { 
        // navigate('/book/${serviceId}')
    }
    const onClickBusiness = () => { 
        // navgate to business profile page
    }

    if (!service) {
        return (<p>404</p>)
    }

    return (
        <>
            <div className="min-h-full">
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{service.serviceName} </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Provider: {service.provider?.businessName || 'N/A'}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Price: $ {service.price?.$numberDecimal || 'N/A'}
                        </p>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Description: {service?.description || 'N/A'}
                        </p>
                        <br></br>

                        <button
                            className="mr-10 rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-neutral-950"
                            onClick={() => onClickBook()}>
                            Book
                        </button>
                        <button
                            className="mr-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => onClickBusiness()}>
                            View Business Profile
                        </button>

                    </div>
                </main>
            </div>
        </>

    )
}

export default Service