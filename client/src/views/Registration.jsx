import React, { useState } from 'react';

import BusinessRegForm from "../components/BusinessRegForm"
import CustomerRegForm from "../components/CustomerRegForm"
import regisrationService from "../services/registration"

const Registration = () => {
  const [accType, setAccType] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('') 
  const [email, setEmail] = useState('') 
  const [address, setAddress] = useState('') 
  const [zipCode, setZipCode] = useState('') 
  const [city, setCity] = useState('') 
  const [state, setState] = useState('') 
  const [phoneNumber, setPhoneNumber] = useState('')
  
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
  }

  const onClickBusiness = () => {
    clearStates();
    setAccType('business');
  }

  const onClickCustomer = () => {
    clearStates();
    setAccType('customer');
  }

  const handleBusiness = async (event) => {
    event.preventDefault()

    // remove this line once av is implemented
    const availability = [{
      "Monday": [{"start": "9:00", "end": "12:00"}],
      "Tuesday": [{"start": "9:00", "end": "12:00"}, {"start": "13:00", "end": "17:00"}]
    }]

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
      availability
    })
}

const businessRegForm = () => {
  return(
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

      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleBusinessNameChange={({ target }) => setBusinessName(target.value)}
      handleAddressChange={({ target }) => setAddress(target.value)}
      handleZipCodeChnage={({ target }) => setZipCode(target.value)}
      handleCityChange={({ target }) => setCity(target.value)}
      handleStateChange={({ target }) => setState(target.value)}
      handleEmailChange={({ target }) => setEmail(target.value)}
      handlePhoneNumberChange={({ target }) => setPhoneNumber(target.value)}

      handleSubmit={handleBusiness}
    />
  ) 
}

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
    </>
  )
}

export default Registration