import { Button, Drawer } from 'antd'
import ModelModal from './Form'
import ModelTable from './Table'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useBoolean } from '@/hooks'
import type { ModelModalRef } from './Form'

export type ModelDrawerRef = {
  show: () => void
}

const ModelDrawer = forwardRef<ModelDrawerRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  useImperativeHandle(ref, () => ({ show }))

  const modelModalRef = useRef<ModelModalRef>(null)

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
      <ModelModal ref={modelModalRef} />
      <ModelTable />
    </Drawer>
  )
})

export default ModelDrawer
