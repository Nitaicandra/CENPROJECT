import axios from '../utils/apiClient'

const registerBusiness = async businessdata => {
    const response = await axios.post('api/users/businesses', businessdata)
    return response.data
  }
  
export default { registerBusiness }