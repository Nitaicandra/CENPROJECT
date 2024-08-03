import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { UserContext } from '../components/UserContext'

import CustomerHome from '../components/CustomerHome'
import BusinessHome from '../components/BusinessHome'
import BookingService from '../services/booking'
import Alert from '../components/Alert'

const Metrics = () => {}

export default Metrics