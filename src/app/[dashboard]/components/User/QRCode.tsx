import CopyToClipboard from 'react-copy-to-clipboard'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal, QRCode, Spin, message } from 'antd'
import { forwardRef, useImperativeHandle } from 'react'
import useSWRMutation from 'swr/mutation'
import { useBoolean } from '@/hooks'
import request from '../../request'

export type UserQRCodeRef = { show: (id: number) => void }

const UserQRCode = forwardRef<UserQRCodeRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)

  const {
    data = '',
    isMutating,
    trigger,
    reset,
  } = useSWRMutation('/api/dashboard/user/link', (url, { arg }: { arg: number }) =>
    request.get<TResponse<string>>(url, { params: { id: arg } }).then(res => res.data.data)
  )

  useImperativeHandle(ref, () => ({
    show: id => {
      trigger(id)
      show()
    },
  }))

  return (
    <Modal
      open={visible}
      closeIcon={null}
      centered
      width={240 + 24 * 2}
      footer={null}
      onCancel={hide}
      afterOpenChange={open => !open && reset()}
    >
      <div className="flex flex-col items-center justify-center">
        <Spin spinning={isMutating}>
          <CopyToClipboard text={data} onCopy={() => message.success('已复制')}>
            <div className="w-[240px] h-[240px] cursor-pointer select-none transition-transform active:scale-95">
              {data && <QRCode bordered={false} size={240} value={data} />}
            </div>
          </CopyToClipboard>
        </Spin>
        <span className="text-sm opacity-40">（点击二维码复制链接）</span>
        <Button className="mt-4" shape="circle" icon={<CloseOutlined />} onClick={hide} />
      </div>
    </Modal>
  )
})

export default UserQRCode
