import ByIcon from '../../assets/by.svg?react'
import CcIcon from '../../assets/cc.svg?react'
import NcIcon from '../../assets/nc.svg?react'

export default function License(): JSX.Element {
  return (
    <div className="collapse bg-base-200" tabIndex={1}>
      <h1 className="collapse-title text-md">License</h1>

      <div className="collapse-content text-sm text-center">
        <span className="font-bold">Crate Cleaner</span> by{' '}
        <a
          href="https://narinsun.com"
          className=" hover:underline"
          rel="cc:attributionURL dct:creator"
        >
          Narin Rico Sundarabhaya
        </a>{' '}
        is licensed under{' '}
        <a
          href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
          target="_blank"
          rel="license noopener noreferrer"
          className="inline-flex items-center hover:underline"
        >
          Attribution-NonCommercial 4.0 International
          <CcIcon className="h-5 w-5 ml-2" />
          <ByIcon className="h-5 w-5 ml-2" />
          <NcIcon className="h-5 w-5 ml-2" />
        </a>
      </div>
    </div>
  )
}
