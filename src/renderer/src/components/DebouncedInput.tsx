import { InputHTMLAttributes, memo, useEffect, useState } from 'react'

export default memo(function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>): JSX.Element {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return (): void => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      className="input input-bordered w-full max-w-xs input-sm mb-2 input-ghost"
      onChange={(e): void => setValue(e.target.value)}
    />
  )
})
