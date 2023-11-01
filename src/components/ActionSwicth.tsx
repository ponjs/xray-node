'use client'

import { Switch } from 'antd'
import { useState } from 'react'
import type { SwitchProps } from 'antd'

interface ActionSwicthProps extends Omit<SwitchProps, 'onChange'> {
  onChange?: (checked: boolean) => void | Promise<unknown>
}

export default function ActionSwicth(props: ActionSwicthProps) {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(props.checked)

  const handleChange = async (_checked: boolean) => {
    setChecked(_checked)
    setLoading(true)

    try {
      await props.onChange?.(_checked)
    } catch (error) {
      setChecked(!_checked)
    }

    setLoading(false)
  }

  return <Switch checked={checked} loading={loading} onChange={handleChange} />
}
