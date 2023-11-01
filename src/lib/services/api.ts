import request from './request'

export const add = (data: XInboundParams) => {
  return request.post<XResponse>('/xui/inbound/add', data)
}

export const list = async () => {
  try {
    const res = await request.post<XResponse<XInboundRecord[]>>('/xui/inbound/list')
    return res.data.obj || []
  } catch {
    return []
  }
}

export const remove = (id: number) => {
  return request.post<XResponse>(`/xui/inbound/del/${id}`)
}

export const update = (id: number, data: XInboundParams) => {
  return request.post(`/xui/inbound/update/${id}`, data)
}
