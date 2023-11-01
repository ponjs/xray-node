import CopyToClipboard from 'react-copy-to-clipboard'
import { Button, Modal, QRCode, message } from 'antd'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useBoolean } from '@/hooks'
import toInbound from '@/lib/services/toInbound'
import { CloseOutlined } from '@ant-design/icons'

export type UserQRCodeRef = { show: (record: TUserRecord) => void }

const UserQRCode = forwardRef<UserQRCodeRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  const [record, setRecord] = useState<TUserRecord>()

  useImperativeHandle(ref, () => ({
    show: reord => {
      setRecord(reord)
      show()
    },
  }))

  const link = useMemo(() => {
    if (!record?.inbound) return ''
    const inbound = toInbound(record.inbound)
    const address = record.model.host || new URL(process.env.X_BASE_URL || '').hostname
    return inbound.genLink(address, record.name)
  }, [record])

  return (
    <Modal
      open={visible}
      closeIcon={null}
      centered
      destroyOnClose
      width={240 + 24 * 2}
      footer={null}
      onCancel={hide}
    >
      <div className="flex flex-col items-center justify-center">
        {link && (
          <CopyToClipboard text={link} onCopy={() => message.success('已复制')}>
            <div className="cursor-pointer select-none">
              <QRCode bordered={false} size={240} value={link} />
            </div>
          </CopyToClipboard>
        )}
        <span className="text-sm opacity-40">（点击二维码复制链接）</span>
        <Button className="mt-6" shape="circle" icon={<CloseOutlined />} onClick={hide} />
      </div>
    </Modal>
  )
})

export default UserQRCode
