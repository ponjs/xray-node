declare namespace NodeJS {
  interface ProcessEnv {
    DASHBOARD_PATH?: string
  }
}

/** 自定义接口返回格式 */
interface TResponse<T = void> {
  code: 200
  data?: T
  msg?: string
}

interface TUserRecord {
  id: number
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
