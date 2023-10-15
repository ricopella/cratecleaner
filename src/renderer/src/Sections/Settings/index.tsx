import Crates from '@renderer/components/Crates'
import useDeletedFilesCount from '@renderer/hooks/useDeletedFilesCount'
import ByIcon from '../../assets/by.svg?react'
import CcIcon from '../../assets/cc.svg?react'
import NcIcon from '../../assets/nc.svg?react'

export default function Settings(): JSX.Element {
  const { status, count } = useDeletedFilesCount()
  return (
    <div className="grid grid-rows-1fr-max h-full w-full">
      <div className="grid gap-6 grid-rows-max-max">
        <div>
          Total deleted files:{' '}
          {status === 'loading' ? 'Loading' : status === 'error' ? 'Error Retrieving' : count}
        </div>
        <Crates />
      </div>

      <div>
        <p className="text-sm text-center">
          <span className="font-bold">Crate Cleaner</span> by{' '}
          <a
            href="https://narinsun.com"
            className="text-blue-500 hover:underline"
            rel="cc:attributionURL dct:creator"
          >
            Narin Rico Sundarabhaya
          </a>{' '}
          is licensed under{' '}
          <a
            href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
            target="_blank"
            rel="license noopener noreferrer"
            className="inline-flex items-center text-blue-500 hover:underline"
          >
            Attribution-NonCommercial 4.0 International
            <CcIcon className="h-5 w-5 ml-2" />
            <ByIcon className="h-5 w-5 ml-2" />
            <NcIcon className="h-5 w-5 ml-2" />
          </a>
        </p>
      </div>
      <div className="grid  justify-center">
        <aside className="text-xs text-neutral-content">
          &copy; {new Date().getFullYear()}, <span>Polyhedron Projects LLC.</span>
        </aside>
      </div>
    </div>
  )
}
