import net from 'net'
import dns from 'dns'

export default function testConnect(address: string, port: number) {
  return new Promise<boolean>(resolve => {
    const socket = new net.Socket()

    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })

    socket.on('error', () => {
      socket.destroy()
      resolve(false)
    })

    dns.lookup(address, (err, ip) => {
      if (err) {
        resolve(false)
      } else {
        socket.connect(port, ip)
      }
    })
  })
}
