import useMain from '@renderer/context/hooks/useMain'
import { useEffect } from 'react'

const classNames = {
  label: 'label',
  labelText: 'label-text text-xs'
}

export default function ConfigurationPanel(): JSX.Element {
  const { state, dispatch } = useMain()
  const changeFileType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch({
      type: 'UPDATE_SCAN_CONFIGURATION_TYPE',
      payload: {
        type: e.target.value as 'audio' | 'image'
      }
    })
  }

  const changeMatchType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch({
      type: 'UPDATE_SCAN_CONFIGURATION_MATCH_TYPE',
      payload: {
        matchType: e.target.value as 'name' | 'contents' | 'size'
      }
    })
  }

  const changeIncludeCrates = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: 'UPDATE_SCAN_CONFIGURATION_INCLUDE_CRATES',
      payload: {
        includeCrates: e.target.checked
      }
    })
  }

  const changeScanType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    dispatch({
      type: 'UPDATE_SCAN_CONFIGURATION_SCAN_TYPE',
      payload: {
        scanType: e.target.value as 'duplicate' | 'not_crated'
      }
    })
  }

  const { scanConfiguration } = state
  const { type, scanType, includeCrates, matchType } = scanConfiguration

  useEffect(() => {
    if (type === 'image' && scanType === 'not_crated') {
      dispatch({
        type: 'UPDATE_SCAN_CONFIGURATION_SCAN_TYPE',
        payload: {
          scanType: 'duplicate'
        }
      })
    }

    if (type === 'image' && includeCrates) {
      dispatch({
        type: 'UPDATE_SCAN_CONFIGURATION_INCLUDE_CRATES',
        payload: {
          includeCrates: false
        }
      })
    }

    if (type === 'audio' && scanType === 'not_crated' && !includeCrates) {
      dispatch({
        type: 'UPDATE_SCAN_CONFIGURATION_INCLUDE_CRATES',
        payload: {
          includeCrates: true
        }
      })
    }
  }, [type, scanConfiguration.scanType, dispatch, scanType, includeCrates])

  return (
    <div className="rounded-t bg-base-200 p-4 border-b-2 border-base-content border-opacity-5">
      <div className="form-control grid sm:grid-cols-max-max-max-max items-center sm:gap-8">
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>File Type:</span>
          </label>
          <select
            className="select select-xs select-bordered"
            value={type}
            onChange={changeFileType}
          >
            <option value={'audio'}>Audio</option>
            <option value={'image'}>Image</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Scan Type:</span>
          </label>
          <select
            className="select select-xs select-bordered"
            value={scanType}
            onChange={changeScanType}
            disabled={type === 'image'}
          >
            <option value={'duplicate'}>Duplicates</option>
            <option value={'not_crated'}>Not in crate</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Match Type:</span>
          </label>
          <select
            className="select select-xs select-bordered"
            value={matchType}
            onChange={changeMatchType}
          >
            <option value={'name'}>File Name</option>
            <option value={'contents'}>File Contents</option>
            <option disabled value={'size'}>
              File Size
            </option>
          </select>
        </div>
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Include Crates:</span>
          </label>
          <input
            className="checkbox checkbox-xs"
            checked={includeCrates}
            onChange={changeIncludeCrates}
            type="checkbox"
            disabled={
              state.scanConfiguration.scanType === 'not_crated' ||
              state.scanConfiguration.type === 'image'
            }
          />
        </div>
      </div>
    </div>
  )
}
