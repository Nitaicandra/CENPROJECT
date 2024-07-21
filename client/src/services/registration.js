import axios from '../utils/apiClient'

const registerBusiness = async businessdata => {
    const response = await axios.post('api/users/businesses', businessdata)
    return response.data
}
  
const registerCustomer = async customerdata => {
  const response = await axios.post('api/users/customers', customerdata)
  return response.data
}

export default { registerBusiness }
export { registerCustomer }