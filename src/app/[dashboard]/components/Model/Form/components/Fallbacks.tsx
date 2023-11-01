import { Button, Form, Input, InputNumber, Tabs } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInbound } from '../context'
import { Inbound, Protocols } from '@/lib/xray'
import type { FormListFieldData, FormListOperation } from 'antd'
import type { Tab } from 'rc-tabs/lib/interface'
import type { NamePath } from 'antd/es/form/interface'

function Fallback({ name }: { name: NamePath }) {
  return (
    <>
      {['name', 'alpn', 'path', 'dest'].map(n => (
        <Form.Item key={n} label={n} name={[name, n]} labelCol={{ span: 3 }}>
          <Input />
        </Form.Item>
      ))}
      <Form.Item label="xver" name={[name, 'xver']} labelCol={{ span: 3 }}>
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
    </>
  )
}

type FallbacksProps = { fields: FormListFieldData[]; operation: FormListOperation }

function Fallbacks({ fields, operation }: FallbacksProps) {
  const inbound = useInbound()

  const [activeKey, setActiveKey] = useState('')
  const [tabKeys, setTabKeys] = useState<string[]>([])

  const newTabIndex = useRef(0)
  const genTabIndex = () => `fallback-tab-${newTabIndex.current++}`

  useEffect(() => {
    if (!activeKey && fields?.length !== tabKeys.length) {
      const _tabKeys = [...fields].map(() => genTabIndex())
      setActiveKey(_tabKeys[0])
      setTabKeys(_tabKeys)
    }
  }, [activeKey, fields, tabKeys.length])

  const handleInsert = () => {
    const newActiveKey = genTabIndex()
    const newTabKeys = [...tabKeys]
    newTabKeys.push(newActiveKey)
    setTabKeys(newTabKeys)
    setActiveKey(newActiveKey)

    switch (inbound.current?.protocol) {
      case Protocols.TROJAN:
        operation.add(new Inbound.TrojanSettings.Fallback())
        break
      default:
        operation.add({ name: '', alpn: '', path: '', dest: '', xver: 0 })
        break
    }
  }

  const handleRemove = (targetKey: React.MouseEvent | React.KeyboardEvent | string) => {
    let newActiveKey = activeKey
    let lastIndex = -1

    tabKeys.forEach((key, i) => key === targetKey && (lastIndex = i - 1))

    const newTabKeys = tabKeys.filter(item => item !== targetKey)
    if (newTabKeys.length && newActiveKey === targetKey) {
      newActiveKey = lastIndex >= 0 ? newTabKeys[lastIndex] : newTabKeys[0]
    }

    setTabKeys(newTabKeys)
    setActiveKey(newActiveKey)

    const removeIndex = lastIndex + 1
    operation.remove(removeIndex)
  }

  const tabs = useMemo<Tab[]>(
    () =>
      fields?.map((field, i) => {
        const key = tabKeys[i] || genTabIndex()
        return {
          key,
          label: `fallback ${i + 1}`,
          children: <Fallback name={field.name} key={key} />,
        }
      }),
    [fields, tabKeys]
  )

  if (!fields.length) return <Button onClick={handleInsert} icon={<PlusOutlined />} />

  return (
    <Tabs
      type="editable-card"
      items={tabs}
      size="small"
      activeKey={activeKey}
      onChange={setActiveKey}
      onEdit={(e, action) => {
        if (action === 'add') handleInsert()
        else if (action === 'remove') handleRemove(e)
      }}
    />
  )
}

export default function FallbackWithForm({ name }: { name: NamePath }) {
  return (
    <Form.Item label="fallbacks">
      <Form.List name={name}>
        {(fields, operation) => <Fallbacks fields={fields} operation={operation} />}
      </Form.List>
    </Form.Item>
  )
}
