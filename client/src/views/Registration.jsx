import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BusinessRegForm from "../components/BusinessRegForm"
import CustomerRegForm from "../components/CustomerRegForm"
import regisrationService from "../services/registration"
import Alert from '../components/Alert'

const Registration = () => {
  const navigate = useNavigate();

  //Common states to both forms 
  const [accType, setAccType] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [alertType, setAlertType] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Availability states
  const initialAvailability = {
    sunday: { checked: false, start: '', end: '' },
    monday: { checked: false, start: '', end: '' },
    tuesday: { checked: false, start: '', end: '' },
    wednesday: { checked: false, start: '', end: '' },
    thursday: { checked: false, start: '', end: '' },
    friday: { checked: false, start: '', end: '' },
    saturday: { checked: false, start: '', end: '' }
  }
  const [availability, setAvailability] = useState(initialAvailability);

  const clearStates = () => {
    setUsername('')
    setPassword('')
    setBusinessName('')
    setEmail('')
    setAddress('')
    setZipCode('')
    setCity('')
    setState('')
    setPhoneNumber('')
    setAvailability(initialAvailability);
  }

  const onClickBusiness = () => {
    clearStates();
    setAccType('business');
  }

  const onClickCustomer = () => {
    clearStates();
    setAccType('customer');
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAvailability((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], checked }
    }));
  }

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const [day, time] = name.split('-');
    setAvailability((prevState) => ({
      ...prevState,
      [day]: { ...prevState[day], [time]: value }
    }));
  }

  const handleBusiness = async (event) => {
    event.preventDefault()

    const formattedAvailability = Object.keys(availability)
      .filter((day) => availability[day].checked)
      .map((day) => ({
        [day.charAt(0).toUpperCase() + day.slice(1)]: [
          { start: availability[day].start, end: availability[day].end }
        ]
      }));

    try {
      await regisrationService.registerBusiness({
        username,
        password,
        businessName,
        address,
        zipCode,
        city,
        state,
        email,
        phoneNumber,
        availability: formattedAvailability
      })

      setAlertMessage('Account was successfully created')
      setAlertType('alert-success')
      setTimeout(() => {
        setAlertMessage(null)
        navigate('/')
      }, 5000)

    } catch (exception) {
      setAlertMessage(exception.response.data.error)
      setAlertType('alert-error')
      setTimeout(() => {
        setAlertMessage(null)
      }, 3000)
    }
  }

  const businessRegForm = () => {
    return (
      <BusinessRegForm
        username={username}
        password={password}
        businessName={businessName}
        address={address}
        zipCode={zipCode}
        city={city}
        state={state}
        email={email}
        phoneNumber={phoneNumber}
        availability={availability}

        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleBusinessNameChange={({ target }) => setBusinessName(target.value)}
        handleAddressChange={({ target }) => setAddress(target.value)}
        handleZipCodeChnage={({ target }) => setZipCode(target.value)}
        handleCityChange={({ target }) => setCity(target.value)}
        handleStateChange={({ target }) => setState(target.value)}
        handleEmailChange={({ target }) => setEmail(target.value)}
        handlePhoneNumberChange={({ target }) => setPhoneNumber(target.value)}
        handleCheckboxChange={handleCheckboxChange}
        handleTimeChange={handleTimeChange}

        handleSubmit={handleBusiness}
      />
    )
  }

  if (accType == 'business') {
    return (
      <>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
          <button
            className="mr-10 rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-neutral-950"
            onClick={() => onClickCustomer()} >
            I am a customer
          </button>
          <button
            className="mx-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onClickBusiness()}>
            I am a business
          </button>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
          {accType === 'business' && businessRegForm()}
          {accType === 'customer' && <CustomerRegForm />}
        </div>
        <br></br>
        <Alert message={alertMessage} type={alertType} />
      </>
    )
  }

  else { // if customer (default)
    return (
      <>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
          <button
            className="mr-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onClickCustomer()} >
            I am a customer
          </button>
          <button
            className="mx-10 rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-neutral-950"
            onClick={() => onClickBusiness()}>
            I am a business
          </button>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
          {accType === 'business' && businessRegForm()}
          {accType === 'customer' && <CustomerRegForm />}
        </div>
        <br></br>
        <Alert message={alertMessage} type={alertType} />
      </>
    )
  }

}

export default Registration