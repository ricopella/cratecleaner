import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SectionTabs from './components/SectionTabs'
import { MainProvider } from './context/MainContext'

const queryClient = new QueryClient()

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MainProvider>
        <div data-theme="luxury">
          <SectionTabs />
        </div>
      </MainProvider>
    </QueryClientProvider>
  )
}

export default App
