import React, { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom';

import ServiceForm from '../components/ServiceForm'
import Alert from '../components/Alert'
import { UserContext } from '../components/UserContext'

import serviceS from '../services/service'

const CreateService = () => {
    const navigate = useNavigate()
    const { user, loading } = useContext(UserContext)

    const [alertType, setAlertType] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)
    const [serviceName, setServiceName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || user.type !== 'business') {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try{
            await serviceS.createService({
                serviceName, description, price
            })

            setAlertMessage('Service was successfully created')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
                navigate('/home')
            }, 2000)
        } 
        catch (exception){
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }

    const serviceForm = () => {
        return(
            < ServiceForm
                serviceName={serviceName}
                description={description}
                price={price}

                handleServiceNameChange={({ target }) => setServiceName(target.value)}
                handleDescriptionChange={({ target }) => setDescription(target.value)}
                handlePriceChange={({ target }) => setPrice(target.value)}

                handleSubmit={handleSubmit}
            />
        )
    }

    return(
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
            <Alert message={alertMessage} type={alertType} />
            { serviceForm() }
        </div>
    )
    
}

export default CreateService
