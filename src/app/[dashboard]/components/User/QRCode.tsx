import CopyToClipboard from 'react-copy-to-clipboard'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Modal, QRCode, Segmented, Spin, message } from 'antd'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useBoolean, useSubLink } from '@/hooks'
import request from '../../request'

export type UserQRCodeRef = { show: (record: TUserRecord) => void }

enum TabKeys {
  Current,
  Subscribe,
}

const TabOptions = [
  { label: '当前节点', value: TabKeys.Current },
  { label: '订阅链接', value: TabKeys.Subscribe },
]

const UserQRCode = forwardRef<UserQRCodeRef>((props, ref) => {
  const [visible, { setTrue: show, setFalse: hide }] = useBoolean(false)
  const [tabKey, setTabKey] = useState(TabKeys.Current)
  const [username, setUsername] = useState('')
  const subLink = useSubLink(username)

  const {
    data = '',
    isMutating,
    trigger,
    reset,
  } = useSWRMutation('/api/dashboard/user/link', (url, { arg }: { arg: number }) =>
    request.get<TResponse<string>>(url, { params: { id: arg } }).then(res => res.data.data)
  )

  useImperativeHandle(ref, () => ({
    show: record => {
      setUsername(record.name)
      trigger(record.id)
      show()
    },
  }))

  const afterOpenChange = (open: boolean) => {
    if (!open) {
      reset()
      setTabKey(TabKeys.Current)
    }
  }

  const link = useMemo(() => (tabKey === TabKeys.Current ? data : subLink), [data, subLink, tabKey])

  return (
    <Modal
      open={visible}
      closeIcon={null}
      centered
      width={240 + 24 * 2}
      footer={null}
      styles={{ content: { padding: '28px 24px 24px' } }}
      onCancel={hide}
      afterOpenChange={afterOpenChange}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full px-[8px]">
          <Segmented
            block
            options={TabOptions}
            value={tabKey}
            onChange={value => setTabKey(value as TabKeys)}
          />
        </div>

        <Spin spinning={isMutating}>
          <CopyToClipboard text={link} onCopy={() => message.success('已复制')}>
            <div className="w-[240px] h-[240px] mt-2 cursor-pointer select-none transition-transform active:scale-95">
              {link && <QRCode bordered={false} size={240} value={link} />}
            </div>
          </CopyToClipboard>
        </Spin>

        <span className="text-sm opacity-40 leading-none">（点击二维码复制链接）</span>

        <Button className="mt-6" shape="circle" icon={<CloseOutlined />} onClick={hide} />
      </div>
    </Modal>
  )
})

export default UserQRCode
