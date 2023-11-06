import { Input } from 'antd'
import { useRef, useState } from 'react'
import type { InputRef } from 'antd'

export default function SearchInput({ onSearch }: { onSearch: (keyword: string) => void }) {
  const [keyword, setKeyword] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<InputRef>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setKeyword(value)

    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => onSearch?.(value), 150)
  }

  return (
    <Input
      className="w-40"
      ref={inputRef}
      placeholder="搜索"
      allowClear
      enterKeyHint="search"
      value={keyword}
      onChange={handleSearch}
      onPressEnter={() => inputRef.current?.blur()}
    />
  )
}
