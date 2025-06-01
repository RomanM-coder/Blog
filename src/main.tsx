import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.tsx'
import './i18n'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false
//     }
//   }
// })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkeletonTheme
      baseColor="#d3d5d5"
      highlightColor="#e6e7e7"
      duration={1.2}
    >  
      <App />
    </SkeletonTheme>    
  </StrictMode>
)
// <QueryClientProvider client={queryClient}>
{/* <App /> */}
// <ReactQueryDevtools initialIsOpen={true} />
// </QueryClientProvider>  


