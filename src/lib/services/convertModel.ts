const randomIntRange = (min = 10000, max = 60000) => Math.round(Math.random() * (max - min)) + min

const randomString = (len = 10) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export default function convertModel(model: {
  port: string
  protocol: string
  settings: string
  streamSettings: string
  sniffing: string
}) {
  return {
    port: randomIntRange(...model.port.split('-').map(p => Number(p))),
    protocol: model.protocol,
    settings: model.settings.replaceAll('<random>', randomString()),
    streamSettings: model.streamSettings,
    sniffing: model.sniffing,
  }
}
