import { useEffect, useMemo, useState } from 'react'

export function useBoolean(defaultValue = false) {
  const [state, setState] = useState(defaultValue)

  const actions = useMemo(
    () => ({
      toggle: () => setState(v => !v),
      set: (v: boolean) => setState(!!v),
      setTrue: () => setState(true),
      setFalse: () => setState(false),
    }),
    []
  )

  return [state, actions] as const
}

export function useSubLink(name: string) {
  const [link, setLink] = useState('')

  useEffect(() => {
    setLink(`${location.origin}/s/${name}`)
  }, [name])

  return link
}

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    setIsDarkMode(mediaQuery.matches)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isDarkMode
}
