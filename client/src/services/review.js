import axios from '../utils/apiClient'

const reply = async (reply, reviewId) => {
  const loggedUserJSON = window.localStorage.getItem('loggedInUser')
  const user = JSON.parse(loggedUserJSON)

  const token = `Bearer ${user.token}`

  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`api/reviews/reply/${reviewId}`, reply, config)
  return response.data 
}
export default {reply}