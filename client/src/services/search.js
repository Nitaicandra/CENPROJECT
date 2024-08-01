import axios from '../utils/apiClient'

const search = async query => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    const user = JSON.parse(loggedUserJSON)

    const token = `Bearer ${user.token}`

    const config = {
      headers: { Authorization: token },
    }

  const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`, config)
  return response.data
}

export default { search }