import { useBoolean } from '@/hooks'
import { Modal } from 'antd'
import ModelForm from './Form'
import { forwardRef, useImperativeHandle, useState } from 'react'

export type FormModalRef = { show: (value?: TModelRecord) => void }

const FormModal = forwardRef<FormModalRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  const [record, setRecord] = useState<TModelRecord>()

  useImperativeHandle(ref, () => ({
    show: value => {
      setRecord(value)
      show()
    },
  }))

  return (
    <Modal
      open={visible}
      title={record ? '编辑模型' : '添加模型'}
      width={640}
      centered
      destroyOnClose
      footer={null}
      onCancel={hide}
    >
      <ModelForm record={record} onCancel={hide} onFinish={hide} />
    </Modal>
  )
})

export default FormModal
