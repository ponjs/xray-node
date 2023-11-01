import { message } from 'antd'
import axios from 'axios'
import useSWR from 'swr'

const _axios = axios.create({
  withCredentials: true,
})

_axios.interceptors.response.use(response => {
  if (response.data?.code !== 200 && response.data?.msg) {
    message.error(response.data?.msg)
  }

  if (response.data?.code === 401) {
    location.reload()
    return Promise.reject(response)
  }

  return response
})

export default _axios

export function useModels() {
  return useSWR('/api/dashboard/model/list', url =>
    _axios.get<TResponse<TModelRecord[]>>(url).then(res => res.data.data || [])
  )
}
