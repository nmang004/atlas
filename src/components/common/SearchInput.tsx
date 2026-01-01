'use client'

import { useState, useMemo } from 'react'

import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { debounce } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  defaultValue?: string
  autoFocus?: boolean
}

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
  autoFocus = false,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        onSearch(query)
      }, SEARCH_DEBOUNCE_MS),
    [onSearch]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="h-10 pl-9 pr-9"
        autoFocus={autoFocus}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
