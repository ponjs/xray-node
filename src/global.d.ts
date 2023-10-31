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
