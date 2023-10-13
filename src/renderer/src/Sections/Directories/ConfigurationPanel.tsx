import { useMain } from '@renderer/context/MainContext'

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

  return (
    <div className="rounded-t bg-base-200 p-4 border-b-2 border-base-content border-opacity-5">
      <div className="form-control flex-row items-center gap-8">
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>File Type:</span>
          </label>
          <select
            className="select select-xs select-bordered"
            defaultValue={state.scanConfiguration.type}
            onChange={changeFileType}
          >
            <option value={'audio'}>Audio</option>
            <option disabled value={'image'}>
              Image
            </option>
          </select>
        </div>
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Match Type:</span>
          </label>
          <select
            className="select select-xs select-bordered"
            defaultValue={state.scanConfiguration.matchType}
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
            defaultChecked
            onChange={changeIncludeCrates}
            type="checkbox"
          />
        </div>
      </div>
    </div>
  )
}
