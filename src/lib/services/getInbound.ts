import { list } from './api'

export default async function getInbound(username: string) {
  try {
    const result = await list()
    return result.find(item => item.remark === username)
  } catch (error) {}
}
