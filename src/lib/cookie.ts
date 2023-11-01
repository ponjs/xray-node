import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import cookie from 'cookie'

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

export const parseCookie = async <N extends keyof CookiePayload>(name: N) => {
  const _cookie = cookies().get(name)
  if (_cookie) {
    try {
      const { payload } = await jwtVerify<CookiePayload[N]>(_cookie.value, JWT_SECRET)
      return payload
    } catch (error) {}
  }
}

export const dashboardVerify = async () => {
  const cookieStore = cookies()
  const manageCookie = cookieStore.get(CookieName.MANAGES)

  if (manageCookie) {
    try {
      const {
        payload: { username, password },
      } = await jwtVerify<CookiePayload[CookieName.MANAGES]>(manageCookie.value, JWT_SECRET)

      if (username === process.env.X_USERNAME && password === process.env.X_PASSWORD) {
        return true
      } else {
        cookieStore.set(CookieName.MANAGES, '')
      }
    } catch (error) {}
  }

  return false
}
