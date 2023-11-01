import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Table, Tag, message } from 'antd'
import ActionButton from '@/components/ActionButton'
import FormModal from './FormModal'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useBoolean } from '@/hooks'
import request, { useModels } from '../../request'
import type { ColumnType } from 'antd/es/table'
import type { FormModalRef } from './FormModal'

export type ModelDrawerRef = { show: () => void }

const ModelDrawer = forwardRef<ModelDrawerRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  useImperativeHandle(ref, () => ({ show }))

  const modelModalRef = useRef<FormModalRef>(null)

  const { data, isLoading, mutate } = useModels()

  const handleDelete = (id: number) =>
    request.post<TResponse>('/api/dashboard/model/delete', { id }).then(res => {
      if (res.data.code === 200) {
        message.success('删除成功')
        mutate()
      }
    })

  const [currentPage, setCurrentPage] = useState(1)

  const columns: ColumnType<TModelRecord>[] = [
    {
      title: '序号',
      width: 62,
      render: (value, record, index) => index + 1 + (currentPage - 1) * 10,
    },
    { title: '名称', dataIndex: 'name' },
    { title: '地址', dataIndex: 'host' },
    {
      title: '端口范围',
      dataIndex: 'port',
      render: (value: string) => {
        const [min, max] = value.split('-').map((p, i) => (
          <Tag key={i} className="m-0" color="blue">
            {p}
          </Tag>
        ))

        return (
          <div className="flex items-center space-x-1">
            {min}
            <span>-</span>
            {max}
          </div>
        )
      },
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      render: value => (
        <Tag className="m-0" color="blue">
          {value}
        </Tag>
      ),
    },
    { title: '用户数量', render: (_, record) => record._count.users },
    {
      title: '操作',
      fixed: 'right',
      width: 66 + 32,
      render: (_, record) => (
        <Space size={2}>
          <ActionButton
            danger
            icon={<DeleteOutlined />}
            popconfirmProps={{
              title: '确定删除？',
              onConfirm: () => handleDelete(record.id),
            }}
          />
          <ActionButton
            icon={<EditOutlined />}
            onClick={() => modelModalRef.current?.show(record)}
          />
        </Space>
      ),
    },
  ]

  return (
    <Drawer
      title="模型管理"
      placement="right"
      size="large"
      destroyOnClose
      open={visible}
      extra={<Button onClick={() => modelModalRef.current?.show()}>添加模型</Button>}
      onClose={hide}
    >
      <FormModal ref={modelModalRef} />

      <Table
        bordered
        loading={isLoading}
        rowKey="id"
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        pagination={{ hideOnSinglePage: true, current: currentPage, onChange: setCurrentPage }}
      />
    </Drawer>
  )
})

export default ModelDrawer
