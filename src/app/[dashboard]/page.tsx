'use client'

import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  QrcodeOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Space, Table, Tag, message, theme } from 'antd'
import Logo from '@/components/Logo'
import ActionButton from '@/components/ActionButton'
import ActionSwicth from '@/components/ActionSwicth'
import UserModal from './components/User/FormModal'
import UserQRCode from './components/User/QRCode'
import SearchInput from './components/User/SearchInput'
import ModelDrawer from './components/Model'
import useSWRMutation from 'swr/mutation'
import { useMemo, useRef, useState } from 'react'
import { formatBytes } from '@/utils'
import dayjs from 'dayjs'
import request, { useUsers } from './request'
import type { MenuProps } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { UserModalRef } from './components/User/FormModal'
import type { UserQRCodeRef } from './components/User/QRCode'
import type { ModelDrawerRef } from './components/Model'

enum MenuKeys {
  User,
  Model,
  Logout,
}

const inboundRender =
  (render: (inbound: XInboundRecord) => React.ReactNode) =>
  (value: any, { inbound }: TUserRecord) =>
    inbound ? render(inbound) : '-'

export default function Dashboard() {
  const {
    token: { colorPrimary },
  } = theme.useToken()

  const userModalRef = useRef<UserModalRef>(null)
  const userQRCodeRef = useRef<UserQRCodeRef>(null)
  const modelDrawerRef = useRef<ModelDrawerRef>(null)

  const logoutMutation = useSWRMutation(
    '/api/dashboard/logout',
    url => request.post<TResponse>(url),
    {
      onSuccess: res => {
        if (res.data.code === 200) {
          location.reload()
        }
      },
    }
  )

  const menu: MenuProps = {
    items: [
      { key: MenuKeys.User, label: '添加用户', icon: <UserAddOutlined /> },
      { key: MenuKeys.Model, label: '模型管理', icon: <BlockOutlined /> },
      { type: 'divider' },
      {
        key: MenuKeys.Logout,
        label: '退出登录',
        icon: logoutMutation.isMutating ? <LoadingOutlined /> : <LogoutOutlined />,
        danger: true,
      },
    ],
    onClick: ({ key }) => {
      switch (Number(key)) {
        case MenuKeys.User:
          userModalRef.current?.show()
          break
        case MenuKeys.Model:
          modelDrawerRef.current?.show()
          break
        case MenuKeys.Logout:
          logoutMutation.trigger()
          break
      }
    },
  }

  const { data, isLoading, mutate } = useUsers()
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const dataSource = useMemo(() => {
    if (!keyword) return data
    const _keyword = keyword.toLowerCase()
    return data?.filter(item => item.name.toLowerCase().includes(_keyword))
  }, [data, keyword])

  const handleSearch = (value: string) => {
    setKeyword(() => value)
    setCurrentPage(1)
  }

  const handleDelete = (id: number) =>
    request.post<TResponse>('/api/dashboard/user/delete', { id }).then(res => {
      if (res.data.code === 200) {
        message.success('删除成功')
        mutate()
      }
    })

  const handleEnable = (data: { id: number; status: boolean }) =>
    request
      .post<TResponse>('/api/dashboard/user/enable', data)
      .then(res => (res.data.code === 200 ? mutate() : Promise.reject(res)))

  const columns: ColumnType<TUserRecord>[] = [
    {
      title: '序号',
      width: 62,
      render: (value, record, index) => index + 1 + (currentPage - 1) * 10,
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: value => {
        if (!keyword) return <div>{value}</div>
        const regex = new RegExp('(' + keyword + ')', 'gi')
        const html = value.replace(regex, `<span style="color: ${colorPrimary}">$1</span>`)
        return <div dangerouslySetInnerHTML={{ __html: html }} />
      },
    },
    { title: '模型', render: (_, record) => record.model.name },
    {
      title: '协议',
      render: inboundRender(({ protocol }) => (
        <Tag className="m-0" color="blue">
          {protocol}
        </Tag>
      )),
    },
    { title: '端口', render: inboundRender(({ port }) => port) },
    {
      title: '流量',
      render: inboundRender(({ up, down, total }) => (
        <div>
          <Tag className="m-0" color="blue">
            {formatBytes(up)} / {formatBytes(down)}
          </Tag>
          {total ? (
            <Tag className="ml-2" color={up + down < total ? 'green' : 'red'}>
              {formatBytes(total)}
            </Tag>
          ) : null}
        </div>
      )),
    },
    {
      title: '到期时间',
      render: inboundRender(({ expiryTime }) => {
        const isExpired = expiryTime && Date.now() >= expiryTime
        return (
          <Tag className="m-0" color={isExpired ? 'red' : 'green'}>
            {expiryTime ? dayjs(expiryTime).format('YYYY-MM-DD') : '无限期'}
          </Tag>
        )
      }),
    },
    {
      title: '启用',
      width: 44 + 32,
      render: (_, record) => (
        <ActionSwicth
          checked={!!record.inbound?.enable}
          onChange={status => handleEnable({ id: record.id, status })}
        />
      ),
    },
    {
      title: '操作',
      width: 100 + 32,
      render: (_, record) => (
        <Space size={2}>
          <ActionButton
            icon={<DeleteOutlined />}
            danger
            popconfirmProps={{
              title: '确定删除？',
              onConfirm: () => handleDelete(record.id),
            }}
          />
          <ActionButton
            icon={<EditOutlined />}
            onClick={() => userModalRef.current?.show(record)}
          />
          {record.inbound ? (
            <ActionButton
              icon={<QrcodeOutlined />}
              onClick={() => userQRCodeRef.current?.show(record)}
            />
          ) : null}
        </Space>
      ),
    },
  ]

  return (
    <div className="max-w-[960px] mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-4">
        <Logo />
        <Space>
          <SearchInput onSearch={handleSearch} />
          <Dropdown placement="bottomRight" menu={menu}>
            <Button icon={<MenuOutlined />} />
          </Dropdown>
        </Space>
      </div>

      <Table
        bordered
        loading={isLoading}
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 'max-content' }}
        pagination={{ hideOnSinglePage: true, current: currentPage, onChange: setCurrentPage }}
      />

      <UserModal ref={userModalRef} />
      <UserQRCode ref={userQRCodeRef} />
      <ModelDrawer ref={modelDrawerRef} />
    </div>
  )
}
