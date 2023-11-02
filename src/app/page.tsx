import { ClockCircleOutlined, LockOutlined, SwapOutlined, WalletOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import Link from 'next/link'
import Logo from '@/components/Logo'
import HomeActions from '@/components/HomeActions'
import HomeQRCode from '@/components/HomeQRCode'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/cookie'
import { formatBytes } from '@/utils'
import convertModel from '@/lib/services/convertModel'
import getInbound from '@/lib/services/getInbound'
import getStatus from '@/lib/services/getStatus'
import * as api from '@/lib/services/api'
import clsx from 'clsx'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const clients = [
  { name: 'Windows', owner: '2dust', repo: 'v2rayN' },
  { name: 'macOS', owner: 'yanue', repo: 'V2rayU' },
  { name: 'Android', owner: '2dust', repo: 'v2rayNG' },
  { name: 'iOS', link: 'https://apps.apple.com/us/app/shadowrocket/id932747118' },
]

const getUserInfo = async () => {
  const userinfo = await verifySession()
  if (!userinfo) return redirect('/login')

  const inbound = await getInbound(userinfo.name)
  if (inbound) return inbound

  const defaults = { remark: userinfo.name, up: 0, down: 0, total: 0, enable: true, expiryTime: 0 }
  await api.add({ ...defaults, ...convertModel(userinfo.model) })
  return defaults
}

export default async function Home() {
  const userInfo = await getUserInfo()
  const { isBexpired, isExceeded, isDisabled } = getStatus(userInfo)

  const information = [
    {
      title: '已用流量',
      show: true,
      mark: false,
      icon: <SwapOutlined />,
      render: () => `${formatBytes(userInfo.up)} / ${formatBytes(userInfo?.down)}`,
    },
    {
      title: '流量总额',
      show: !!userInfo.total,
      mark: isExceeded,
      icon: <WalletOutlined />,
      render: () => formatBytes(userInfo.total),
    },
    {
      title: '到期时间',
      show: !!userInfo.expiryTime,
      mark: isBexpired,
      icon: <ClockCircleOutlined />,
      render: () => dayjs(userInfo.expiryTime).format('YYYY-MM-DD'),
    },
  ]

  return (
    <div className="max-w-[60ch] mx-auto pt-24 px-8 pb-16">
      <div className="flex justify-between items-end">
        <Logo />
        <HomeActions name={userInfo.remark} />
      </div>

      <div className="flex items-center mt-2">
        <h2 className="font-extrabold text-2xl">{userInfo.remark}</h2>
        {isDisabled || isExceeded || isBexpired ? (
          <LockOutlined className="text-sm text-red-400 ml-2" title="已禁用" />
        ) : null}
      </div>

      <div className="flex flex-wrap text-sm">
        {information.map(info =>
          info.show ? (
            <Tooltip key={info.title} placement="right" title={info.title}>
              <div className="flex items-center mr-8 mt-1 cursor-default">
                <div className="opacity-60">{info.icon}</div>
                <div className={clsx('ml-2', info.mark ? 'text-red-400' : 'opacity-60')}>
                  {info.render()}
                </div>
              </div>
            </Tooltip>
          ) : null
        )}
      </div>

      <HomeQRCode name={userInfo.remark} />

      <div className="text-sm">
        {clients.map(client => (
          <div key={client.name} className="mb-2">
            <Link
              className="opacity-60 hover:opacity-40 transition inline-block pd-2 border-b-[1px] border-current cursor-pointer"
              href={
                client.link
                  ? client.link
                  : `https://github.com/${client.owner}/${client.repo}/releases/latest`
              }
            >
              {client.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
