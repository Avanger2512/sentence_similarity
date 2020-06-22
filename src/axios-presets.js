import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://test-backend.sempi.tech/v1',
  withCredentials: false
})
