import { useEffect, useState } from 'react'

const classNames = {
  errorTextWrapper: 'transition-all duration-500 transition-max-height ease-in-out overflow-y-auto',
  show: 'opacity-100 translate-y-0 max-h-[10rem]',
  hide: 'opacity-0 translate-y-5 max-h-4',
  errorText: 'text-sm text-error'
}

const ErrorComponent = ({ error }: { error: string | null }): JSX.Element => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (error) {
      setShow(true)
      const timer1 = setTimeout(() => setShow(false), 20000) // 20 seconds

      return () => {
        clearTimeout(timer1)
      }
    }

    return () => {}
  }, [error])

  return (
    <div className={`${classNames.errorTextWrapper} ${show ? classNames.show : classNames.hide}`}>
      {error && <div className={classNames.errorText}>{error}</div>}
    </div>
  )
}

export default ErrorComponent
