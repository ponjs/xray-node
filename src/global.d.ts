declare namespace NodeJS {
  interface ProcessEnv {
    DASHBOARD_PATH?: string
    X_BASE_URL?: string
    X_USERNAME?: string
    X_PASSWORD?: string
  }
}

/** 自定义接口返回格式 */
interface TResponse<T = void> {
  code: 200 | 401 | 422 | 500
  data?: T
  msg?: string
}

/** x-ui 返回的数据格式 */
interface XResponse<T = null> {
  success: boolean
  obj: T
  msg: string
}

/** x-ui 返回的入站 */
interface XInboundRecord {
  id: number
  up: number
  down: number
  total: number
  remark: string
  enable: boolean
  expiryTime: number
  listen: string
  port: number
  protocol: string
  settings: string
  streamSettings: string
  tag: string
  sniffing: string
}

type XInboundParams = Omit<XInboundRecord, 'id' | 'tag'>

interface TUserRecord {
  id: number
  name: string
  model: Pick<TModelRecord, 'id' | 'name' | 'host'>
  inbound?: XInboundRecord
}

interface TModelRecord {
  id: number
  name: string
  host: string
  port: string
  protocol: string
  settings: string
  streamSettings: string
  sniffing: string
  _count: {
    users: number
  }
}
