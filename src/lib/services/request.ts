import axios from 'axios'
import qs from 'qs'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    transformed?: boolean
  }
}

const _axios = axios.create({
  baseURL: process.env.X_BASE_URL,
  withCredentials: true,
  headers: {
    common: { 'X-Requested-With': 'XMLHttpRequest' },
    post: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
  },
})

let cookie = ''
let isRefreshing = false
let requestQueue: { resolve: () => void; reject: (reason?: any) => void }[] = []

const executeQueue = (error?: any) => {
  requestQueue.forEach(promise => (error ? promise.reject(error) : promise.resolve()))
  requestQueue = []
}

const getCookie = () =>
  _axios
    .post('/login', { username: process.env.X_USERNAME, password: process.env.X_PASSWORD })
    .then(res => res.headers['set-cookie']?.join('; ') || Promise.reject(res))

const refreshCookie = () => {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => requestQueue.push({ resolve, reject }))
  }

  isRefreshing = true
  return new Promise<void>((resolve, reject) => {
    getCookie()
      .then(res => {
        cookie = res
        resolve()
        executeQueue(null)
      })
      .catch(err => {
        cookie = ''
        reject(err)
        executeQueue(err)
      })
      .finally(() => (isRefreshing = false))
  })
}

_axios.interceptors.request.use(config => {
  config.headers['Cookie'] = cookie
  if (!config.transformed) {
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
    config.transformed = true
  }
  return config
})

_axios.interceptors.response.use(response => {
  if (response.data?.msg === '登录时效已过，请重新登录') {
    return refreshCookie().then(() => _axios(response.config))
  }
  return response.data.success ? response : Promise.reject(response)
})

export default _axios
