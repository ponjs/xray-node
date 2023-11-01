export type TFormData = {
  name: string
  host: string
  port: string
} & FormTrojan

export type TSniffing = {
  sniffing: {
    enabled: boolean
  }
}

export type TFallback = {
  name: string
  alpn: string
  path: string
  dest: string
  xver: number
}

export type TTLSSettings = {
  stream: {
    network: string
    security: string
    tcp?: {
      acceptProxyProtocol: boolean
    }
    tls?: {
      server: string
      alpn: string
      certs: (
        | { useFile: true; certFile: string; keyFile: string }
        | { useFile: false; cert: string; key: string }
      )[]
    }
  }
  tls: boolean
  xtls: boolean
}

export type TFormTrojan = {
  protocol: 'trojan'
  settings: {
    clients: {
      password: string
      flow: string
    }[]
    fallbacks: Fallback[]
  }
} & TSniffing &
  TTLSSettings
