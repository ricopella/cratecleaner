import { LineWave } from 'react-loader-spinner'

const Loader = (): JSX.Element => {
  return (
    <LineWave
      height="120"
      width="120"
      color="hsl(var(--bc))"
      ariaLabel="line-wave"
      wrapperStyle={{}}
      visible
    />
  )
}

export default Loader
