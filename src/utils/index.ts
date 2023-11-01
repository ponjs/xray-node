import { ObjectUtil } from '@/lib/xray.js'

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function toInboundJson({
  settings,
  streamSettings,
  sniffing,
}: {
  settings: string
  streamSettings: string
  sniffing: string
}) {
  return {
    settings: ObjectUtil.isEmpty(settings) ? {} : JSON.parse(settings),
    streamSettings: ObjectUtil.isEmpty(streamSettings) ? {} : JSON.parse(streamSettings),
    sniffing: ObjectUtil.isEmpty(sniffing) ? {} : JSON.parse(sniffing),
  }
}

export function assignValues(
  obj: Record<string, any>,
  keys: string | (string | number)[],
  value: any
) {
  if (typeof keys === 'string') {
    obj[keys] = value
    return
  }

  if (Array.isArray(keys) && keys.length) {
    const [currentKey, nextKey, ...restKeys] = keys
    if (currentKey === undefined) return

    const currentVal = obj[currentKey]

    if (nextKey === undefined) {
      obj[currentKey] = value
      return
    }

    if (currentVal === undefined || currentVal === null) {
      obj[currentKey] = typeof nextKey === 'number' ? [] : {}
    }

    assignValues(obj[currentKey], [nextKey, ...restKeys], value)
  }
}
