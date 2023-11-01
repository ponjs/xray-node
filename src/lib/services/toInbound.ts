import { Inbound, ObjectUtil } from '../xray.js'

export default function toInbound(dbInbound: {
  port?: number
  protocol?: string
  settings?: string
  streamSettings?: string
  sniffing?: string
}) {
  return Inbound.fromJson({
    ...dbInbound,
    settings: ObjectUtil.isEmpty(dbInbound.settings) ? {} : JSON.parse(dbInbound.settings!),
    streamSettings: ObjectUtil.isEmpty(dbInbound.streamSettings)
      ? {}
      : JSON.parse(dbInbound.streamSettings!),
    sniffing: ObjectUtil.isEmpty(dbInbound.sniffing) ? {} : JSON.parse(dbInbound.sniffing!),
  })
}
