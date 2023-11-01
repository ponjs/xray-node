import { FLOW_CONTROL, Protocols } from '@/lib/xray.js'

export const PROTOCOL_OPTIONS = [{ value: Protocols.TROJAN }]

export const FLOW_OPTIONS = [
  { value: 'none' },
  { value: FLOW_CONTROL.ORIGIN },
  { value: FLOW_CONTROL.DIRECT },
]

export const NETWORK_OPTIONS = [
  { value: 'tcp' },
  { value: 'kcp' },
  { value: 'ws' },
  { value: 'http' },
  { value: 'quic' },
  { value: 'grpc' },
]
