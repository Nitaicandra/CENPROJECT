import axios from '../utils/apiClient'

const login = async credentials => {
  const response = await axios.post('api/login', credentials)
  return response.data
}

const getAccount = async() => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(`api/users/account`, config)
  return response.data 
}

export default { login, getAccount }