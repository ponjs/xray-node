import { Table } from 'antd'
import { useModels } from '../../request'
import type { ColumnType } from 'antd/es/table'

export default function ModelTable() {
  const { data, isLoading } = useModels()

  const columns: ColumnType<TModelRecord>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '地址', dataIndex: 'host' },
    { title: '端口范围', dataIndex: 'port' },
    { title: '协议', dataIndex: 'protocol' },
    { title: '用户数量' },
    {
      title: '操作',
      fixed: 'right',
    },
  ]

  return (
    <Table
      bordered
      loading={isLoading}
      rowKey="id"
      columns={columns}
      dataSource={data}
      scroll={{ x: 'max-content' }}
      pagination={{ hideOnSinglePage: true }}
    />
  )
}
