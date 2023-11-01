import { Modal } from 'antd'
import UserForm from './Form'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useBoolean } from '@/hooks'

export type UserModalRef = { show: (value?: TUserRecord) => void }

const UserModal = forwardRef<UserModalRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  const [record, setRecord] = useState<TUserRecord>()

  useImperativeHandle(ref, () => ({
    show: value => {
      setRecord(value)
      show()
    },
  }))

  return (
    <Modal
      open={visible}
      title={record ? '编辑用户' : '添加用户'}
      width={420}
      centered
      destroyOnClose
      footer={null}
      onCancel={hide}
    >
      <UserForm record={record} onCancel={hide} onFinish={hide} />
    </Modal>
  )
})

export default UserModal
