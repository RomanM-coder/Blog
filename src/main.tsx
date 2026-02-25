// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './i18n'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <SkeletonTheme baseColor="#d3d5d5" highlightColor="#e6e7e7" duration={1.2}>
    <App />
  </SkeletonTheme>,
  // </StrictMode>
)
