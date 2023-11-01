'use client'

import { Button, Popconfirm, Tooltip } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { PopconfirmProps } from 'antd'

interface ActionButtonProps {
  popconfirmProps?: Omit<PopconfirmProps, 'children'>
  label?: string
  icon?: React.ReactNode
  danger?: boolean
  onClick?: () => void | Promise<unknown>
}

export default function ActionButton(props: ActionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await props.onClick?.()
    } catch (error) {}
    setLoading(false)
  }

  const dom = (
    <Tooltip title={props.label}>
      <Button
        type="link"
        danger={props.danger}
        icon={loading ? <LoadingOutlined /> : props.icon}
        onClick={handleClick}
      />
    </Tooltip>
  )

  return props.popconfirmProps ? <Popconfirm {...props.popconfirmProps}>{dom}</Popconfirm> : dom
}
