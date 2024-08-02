import axios from '../utils/apiClient'

const getBusiness = async (businessId) => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

    const response = await axios.get(`api/users/businesses/${businessId}`, config)
    return response.data 
}

export default {getBusiness}