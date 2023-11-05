type TRecorderItem = { count: number; timestamp: number[] }

export default class ForceUpdate {
  lastClearTime: number
  recorder: Map<string, TRecorderItem>

  constructor(
    /**
     * {interval} 毫秒内的第 {continuous} 次为强刷
     * 一天只能有 {maximum} 次强刷
     */
    public config: {
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

    const { count, timestamp } = this.recorder.get(key) || { count: 0, timestamp: [] }

    if (count >= this.config.maximum) return

    if (timestamp[0] && now > timestamp[0] + this.config.interval) {
      this.recorder.set(key, { count, timestamp: [] })
      return
    }

    if (this.config.continuous <= timestamp.length + 1) {
      const result = await callback()
      this.recorder.set(key, { count: count + 1, timestamp: [] })
      return result
    } else {
      this.recorder.set(key, { count, timestamp: timestamp.concat(now) })
    }
  }
}
