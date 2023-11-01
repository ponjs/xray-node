export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function organizeObject(
  obj: Record<string, any>,
  keys: string | (string | number)[],
  value: any
) {
  if (typeof keys === 'string') {
    obj[keys] = value
    return
  }

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

  organizeObject(obj[currentKey], [nextKey, ...restKeys], value)
}

export const ONE_GB = 1024 * 1024 * 1024

export function toFixed(num: number, n: number) {
  n = Math.pow(10, n)
  return Math.round(num * n) / n
}
