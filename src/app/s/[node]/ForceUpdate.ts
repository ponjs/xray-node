type TRecorderItem = { count: number; timestamp: number[] }

export default class ForceUpdate {
  private lastClearTime: number
  private recorder: Map<string, TRecorderItem>

  constructor(
    /**
     * {interval} 毫秒内的第 {continuous} 次为强刷
     * 一天只能有 {maximum} 次强刷
     */
    private config: {
      maximum: number
      interval: number
      continuous: number
    }
  ) {
    this.lastClearTime = new Date().setHours(0, 0, 0, 0)
    this.recorder = new Map<string, TRecorderItem>()
  }

  async call<T = unknown>(key: string, callback: () => Promise<T>) {
    const now = Date.now()

    if (now - this.lastClearTime >= 24 * 60 * 60 * 1000) {
      this.recorder.clear()
      this.lastClearTime = new Date().setHours(0, 0, 0, 0)
    }

    const current = this.recorder.get(key)
    const count = current?.count || 0
    let timestamp = current?.timestamp || []

    if (count >= this.config.maximum) return
    if (timestamp[0] && now > timestamp[0] + this.config.interval) timestamp = []

    if (timestamp.length + 1 >= this.config.continuous) {
      const result = await callback()
      this.recorder.set(key, { count: count + 1, timestamp: [] })
      return result
    } else {
      this.recorder.set(key, { count, timestamp: timestamp.concat(now) })
    }
  }
}
