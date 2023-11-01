import axios from 'axios'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

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

export function useModels() {
  return useSWR('/api/dashboard/models', url =>
    axios
      .get<TResponse<TModelRecord[]>>(url, { withCredentials: true })
      .then(res => res.data.data || [])
  )
}
