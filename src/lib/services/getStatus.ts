export default function getStatus(inbound: {
  enable?: boolean
  up?: number
  down?: number
  total?: number
  expiryTime?: number
}) {
  return {
    isBexpired: inbound.expiryTime && Date.now() >= inbound.expiryTime,
    isExceeded: inbound.total && inbound.up! + inbound.down! >= inbound.total,
    isDisabled: !inbound.enable,
  }
}
