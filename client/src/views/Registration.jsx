import React, { useState } from 'react';

import BusinessRegForm from "../components/BusinessRegForm"
import CustomerRegForm from "../components/CustomerRegForm"

const Registration = () => {
  const [accType, setAccType] = useState(null);
    return (
      <>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
        <button
          className="mr-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setAccType('customer')} >
          I am a customer
        </button>
        <button
          className="mx-10 rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-neutral-950"
          onClick={() => setAccType('business')}>
          I am a business
        </button>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full md:max-w-2xl">
          {accType === 'business' && <BusinessRegForm />}
          {accType === 'customer' && <CustomerRegForm />}
        </div>
        <br></br>
        </>
      )
}

export default Registration