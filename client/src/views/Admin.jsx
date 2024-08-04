import React, { useState, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

import { UserContext } from '../components/UserContext'
import AdminRegForm from '../components/AdminRegForm'
import Alert from '../components/Alert'

import AdminServ from '../services/adminregistration'

const Admin = () => {
    const { user, loading } = useContext(UserContext)
    const navigate = useNavigate()

    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [department, setDepartment] = useState('')

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || user.type !== 'admin') {
        return <Navigate to="/" />
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            await AdminServ.registerAdmin({
                username,
                password,
                firstName,
                lastName,
                department,
                email,
            })

            setAlertMessage('Account was successfully created')
            setAlertType('alert-success')
            setTimeout(() => {
                setAlertMessage(null)
                navigate('/')
            }, 2000)
        } catch (exception) {
            setAlertMessage(exception.response.data.error)
            setAlertType('alert-error')
            setTimeout(() => {
                setAlertMessage(null)
            }, 3000)
        }
    }

    const adminRegForm = () => {
        return (
            <AdminRegForm
                username={username}
                password={password}
                firstName={firstName}
                lastName={lastName}
                department={department}
                email={email}

                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleFirstNameChange={({ target }) => setFirstName(target.value)}
                handleLastNameChange={({ target }) => setLastName(target.value)}
                handleDepartmentChange={({ target }) => setDepartment(target.value)}
                handleEmailChange={({ target }) => setEmail(target.value)}


                handleSubmit={handleSubmit}

            />
        )
    }

    return (
        <div className="min-h-full">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, <span>&nbsp; </span> {user.username}</h1>
                </div>
            </header>
            <main>
            <Alert message={alertMessage} type={alertType} />
                <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
                    {adminRegForm()}
                </div>
            </main>
        </div>

    )
}

export default Admin