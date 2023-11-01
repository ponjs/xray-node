import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import cookie from 'cookie'
import prisma from './prisma'

export enum CookieName {
  SESSION = 'x_session',
  MANAGES = 'x_manages',
}

type CookiePayload = {
  [CookieName.SESSION]: {
    username: string
  }
  [CookieName.MANAGES]: {
    username: string
    password: string
  }
}

const JWT_SECRET = new TextEncoder().encode('x_secret')

export const setCookie = async <N extends keyof CookiePayload>(
  name: N,
  payload: CookiePayload[N]
) => {
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('30d')
    .sign(JWT_SECRET)

  const cookieStr = cookie.serialize(name, session, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return {
    'Set-Cookie': cookieStr,
  }
}

export const clsCookie = (name: keyof CookiePayload) => {
  const cookieStr = cookie.serialize(name, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return {
    'Set-Cookie': cookieStr,
  }
}

export const verifySession = async () => {
  const cookieStore = cookies()
  const _cookie = cookieStore.get(CookieName.SESSION)

  if (_cookie) {
    try {
      const {
        payload: { username },
      } = await jwtVerify<CookiePayload[CookieName.SESSION]>(_cookie.value, JWT_SECRET)

      const userinfo = await prisma.user.findUnique({
        where: { name: username },
        include: { model: true },
      })

      if (userinfo) {
        return userinfo
      } else {
        cookieStore.set(CookieName.SESSION, '')
      }
    } catch (error) {}
  }
}

export const verifyManages = async () => {
  const cookieStore = cookies()
  const _cookie = cookieStore.get(CookieName.MANAGES)

  if (_cookie) {
    try {
      const {
        payload: { username, password },
      } = await jwtVerify<CookiePayload[CookieName.MANAGES]>(_cookie.value, JWT_SECRET)

      if (username === process.env.X_USERNAME && password === process.env.X_PASSWORD) {
        return true
      } else {
        cookieStore.set(CookieName.MANAGES, '')
      }
    } catch (error) {}
  }

  return false
}
