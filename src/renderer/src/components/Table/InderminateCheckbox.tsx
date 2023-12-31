import { HTMLProps, useEffect, useRef } from 'react'

export default function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>): JSX.Element {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <div className="flex items-center">
      <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />
    </div>
  )
}
