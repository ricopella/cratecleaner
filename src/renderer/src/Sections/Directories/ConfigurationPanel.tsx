const classNames = {
  label: 'label',
  labelText: 'label-text text-xs'
}

export default function ConfigurationPanel(): JSX.Element {
  return (
    <div className="rounded-t bg-base-200 p-4 border-b-2 border-base-content border-opacity-5">
      <div className="form-control flex-row items-center gap-8">
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>File Type:</span>
          </label>
          <select className="select select-xs select-bordered" defaultValue={'audio'}>
            <option selected value={'audio'}>
              Audio
            </option>
            <option disabled value={'video'}>
              Image
            </option>
          </select>
        </div>
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Match Type:</span>
          </label>
          <select className="select select-xs select-bordered" defaultValue={'contents'}>
            <option selected value={'contents'}>
              File Contents
            </option>
            <option disabled value={'name'}>
              File Name
            </option>
            <option disabled value={'size'}>
              File Size
            </option>
          </select>
        </div>
        <div className="flex items-center">
          <label className={classNames.label}>
            <span className={classNames.labelText}>Include Crates:</span>
          </label>
          <input type="checkbox" className="checkbox checkbox-xs" disabled defaultChecked />
        </div>
      </div>
    </div>
  )
}
