import axios from '../utils/apiClient'

const login = async credentials => {
  const response = await axios.post('api/login', credentials)
  return response.data
}

export default { login }