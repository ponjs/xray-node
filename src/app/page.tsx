import { ClockCircleOutlined, LockOutlined, SwapOutlined, WalletOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/Logo'
import HomeActions from '@/components/HomeActions'
import QRCode from 'qrcode'
import { headers } from 'next/headers'
import { formatBytes } from '@/utils'
import clsx from 'clsx'
import dayjs from 'dayjs'

const clients = [
  { name: 'Windows', owner: '2dust', repo: 'v2rayN' },
  { name: 'macOS', owner: 'yanue', repo: 'V2rayU' },
  { name: 'Android', owner: '2dust', repo: 'v2rayNG' },
  { name: 'iOS', link: 'https://apps.apple.com/us/app/shadowrocket/id932747118' },
]

export default async function Home() {
  const userinfo = {
    name: 'Test',
    enable: false,
    up: 0,
    down: 0,
    total: 1000000,
    expiryTime: 0,
  }

  const isBexpired = userinfo.expiryTime && Date.now() >= userinfo.expiryTime
  const isExceeded = userinfo.total && userinfo.up + userinfo.down >= userinfo.total
  const isDisabled = !userinfo.enable

  const information = [
    {
      title: '已用流量',
      show: true,
      mark: false,
      icon: <SwapOutlined />,
      render: () => `${formatBytes(userinfo.up)} / ${formatBytes(userinfo.down)}`,
    },
    {
      title: '流量总额',
      show: !!userinfo.total,
      mark: isExceeded,
      icon: <WalletOutlined />,
      render: () => formatBytes(userinfo.total),
    },
    {
      title: '到期时间',
      show: !!userinfo.expiryTime,
      mark: isBexpired,
      icon: <ClockCircleOutlined />,
      render: () => dayjs(userinfo.expiryTime).format('YYYY-MM-DD'),
    },
  ]

  const referer = headers().get('referer')
  const link = referer ? `${new URL(referer).origin}/s/${userinfo.name}` : ''

  const qrcode = await QRCode.toDataURL(link, {
    margin: 1.5,
    width: 180 * 2,
    type: 'image/webp',
  }).catch(() => '')

  return (
    <div className="max-w-[70ch] mx-auto pt-24 px-8 pb-16">
      <div className="flex justify-between items-end">
        <Logo />
        <HomeActions link={link} />
      </div>

      <div className="flex items-center mt-2">
        <h2 className="font-extrabold text-2xl">{userinfo.name}</h2>
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

      <Image
        // 1 + 15 / 180 = 1.0833
        className="my-8 scale-[1.0833] dark:scale-[1] dark:opacity-90"
        alt="qrcode"
        src={qrcode}
        width={180}
        height={180}
      />

      <div className="text-sm">
        {clients.map(client => (
          <div
            key={client.name}
            className="opacity-60 hover:opacity-40 transition mb-2 cursor-pointer"
          >
            <Link
              className="inline-block pd-2 border-b-[1px] border-current"
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
