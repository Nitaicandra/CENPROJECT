import axios from '../utils/apiClient'

const registerAdmin = async data => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

    const response = await axios.post('api/users/admins', data, config)
    return response.data
}

export default { registerAdmin }