import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface LoadingWrapperProps {
  children: React.ReactNode
  loading: boolean
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children, loading }) => {
  if (loading) {
    console.log('Number of children:', React.Children.count(children))
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {

            const { width, height } = child.props.style || {}
            // console.log('isValidElement: ', width)
            return <Skeleton width={width} height={height} />
          }
          console.log('inValidElement: ')
          return null
        })}
      </div>
    )
  }

  return <>{children}</>
}

export default LoadingWrapper