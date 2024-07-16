import axios from '../utils/apiClient'

const createService = async service => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

    const response = await axios.post('api/services', service, config)
    return response.data
  }
  
export default { createService }