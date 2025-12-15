import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/auth';


export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  })
  return response.data
}
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData)
  return response.data
}