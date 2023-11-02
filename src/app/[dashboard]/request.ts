import { message } from 'antd'
import axios from 'axios'
import useSWR from 'swr'

const _axios = axios.create({
  withCredentials: true,
})

_axios.interceptors.response.use(
  response => {
    if (response.data?.code !== 200 && response.data?.msg) {
      message.error(response.data?.msg)
    }

    if (response.data?.code === 401) {
      location.reload()
      return Promise.reject(response)
    }

    return response
  },
  error => {
    if (error?.status === 500) {
      message.error('服务器异常，请稍后再试')
    }

    return Promise.reject(error)
  }
)

export default _axios

export const useModels = () =>
  useSWR('/api/dashboard/model/list', url =>
    _axios.get<TResponse<TModelRecord[]>>(url).then(res => res.data.data || [])
  )

export const useUsers = () =>
  useSWR('/api/dashboard/user/list', url =>
    _axios.get<TResponse<TUserRecord[]>>(url).then(res => res.data?.data || [])
  )
