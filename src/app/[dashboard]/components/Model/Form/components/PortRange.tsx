import { InputNumber } from 'antd'
import { useMemo } from 'react'

interface PortRangeProps {
  value?: string
  onChange?: (value?: string) => void
}

export default function PortRange({ value, onChange }: PortRangeProps) {
  const [min, max] = useMemo(
    () =>
      (value || null)?.split?.('-').map(n => {
        const num = Number(n)
        return n === '' || isNaN(num) ? undefined : num
      }) || [],
    [value]
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <InputNumber
        value={min}
        min={0}
        onBlur={() => {
          if (typeof min !== 'number') return onChange?.('')
          let _max = max ?? min
          if (min > _max) _max = min
          onChange?.(`${min}-${_max}`)
        }}
        onChange={n => onChange?.(`${n}-${max ?? ''}`)}
      />
      <span style={{ width: 24, textAlign: 'center' }}>-</span>
      <InputNumber
        value={max}
        min={0}
        onBlur={() => {
          if (typeof max !== 'number') return onChange?.('')
          let _min = min ?? max
          if (_min > max) _min = max
          onChange?.(`${_min}-${max}`)
        }}
        onChange={n => onChange?.(`${min ?? ''}-${n}`)}
      />
    </div>
  )
}
