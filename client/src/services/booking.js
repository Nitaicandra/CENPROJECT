import axios from '../utils/apiClient'

const createBooking = async (booking, serviceId) => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

    const url = `api/bookings/book-service/${serviceId}`

    const response = await axios.post(url, booking, config)
    return response.data
  }

const getBookings = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

    const response = await axios.get(`api/bookings/future`, config)
    return response.data 
}

const getBooking = async (bookingId) => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`api/bookings/${bookingId}`, config)
  return response.data 
}

const getpastBookings = async () => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`api/bookings/past`, config)
  return response.data 
}

const editBooking = async (data, bookingId) => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`api/bookings/edit/${bookingId}`, data, config)
  return response.data 
}

const deleteBooking = async (bookingId) => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`api/bookings/${bookingId}`, config)
  return response.data 
}

export default { createBooking, getBookings, getBooking, getpastBookings, editBooking, deleteBooking }
