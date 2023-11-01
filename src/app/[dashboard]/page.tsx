'use client'

import { BlockOutlined, LogoutOutlined, MenuOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Dropdown, Table } from 'antd'
import Logo from '@/components/Logo'
import UserModal from './components/User'
import ModelDrawer from './components/Model'
import { useRef } from 'react'
import useSWR from 'swr'
import axios from './request'
import type { MenuProps } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { UserModalRef } from './components/User'
import type { ModelDrawerRef } from './components/Model'

enum MenuKeys {
  User,
  Model,
  Logout,
}

export default function Dashboard() {
  const userModalRef = useRef<UserModalRef>(null)
  const modelDrawerRef = useRef<ModelDrawerRef>(null)

  const menu: MenuProps = {
    items: [
      { key: MenuKeys.User, label: '添加用户', icon: <UserAddOutlined /> },
      { key: MenuKeys.Model, label: '模型管理', icon: <BlockOutlined /> },
      { type: 'divider' },
      { key: MenuKeys.Logout, label: '退出登录', icon: <LogoutOutlined />, danger: true },
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
          axios
            .post<TResponse>('/api/dashboard/logout')
            .then(res => res.data.code === 200 && location.reload())
          break
      }
    },
  }

  const { data, isLoading } = useSWR('/api/dashboard/users', url =>
    axios.get<TResponse<TUserRecord[]>>(url).then(res => res.data?.data || [])
  )

  const columns: ColumnType<TUserRecord>[] = [
    { title: '序号', width: 62, render: (value, record, index) => index + 1 },
    { title: '名称', dataIndex: 'name' },
    { title: '模型' },
    { title: '协议' },
    { title: '端口' },
    { title: '流量' },
    { title: '到期时间' },
    {
      title: '启用',
      width: 44 + 32,
    },
    {
      title: '操作',
      width: 100 + 32,
    },
  ]

  return (
    <div className="max-w-[960px] mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-4">
        <Logo />
        <Dropdown placement="bottomRight" menu={menu}>
          <Button icon={<MenuOutlined />} />
        </Dropdown>
      </div>

      <Table
        bordered
        loading={isLoading}
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        pagination={{ hideOnSinglePage: true }}
      />

      <UserModal ref={userModalRef} />
      <ModelDrawer ref={modelDrawerRef} />
    </div>
  )
}
