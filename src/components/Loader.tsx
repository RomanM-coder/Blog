import CircularProgress from '@mui/material/CircularProgress'

export const Loader = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <CircularProgress style={{color: 'blue'}} />             
    </div>
  )
}