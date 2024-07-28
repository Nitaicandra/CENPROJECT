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
  
export default { createBooking }