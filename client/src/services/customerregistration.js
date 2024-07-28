import axios from '../utils/apiClient'

const registerCustomer = async customerdata => {
    const response = await axios.post('api/users/customers', customerdata)
    return response.data
}

export default { registerCustomer }