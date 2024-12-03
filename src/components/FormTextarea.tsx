import React from 'react'

interface FormTextareaProps {
  id: string
  name: string    
  placeholder: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  className: string | undefined
  value?: any
  rows: number
  required: boolean
  error: any 
  label: string
  [props: string]: any
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id, 
  name, 
  placeholder,
  onChange,  
  className,
  value,
  rows,
  required,
  error,  
  label
}) => {  
  
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={id}       
        name={name}        
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        rows={rows}
        required={required}
        className={className}
        // style={error && {border: 'solid 1px red'}}
      />
      {/* { error && <p>{ error }</p>} */}
    </>
  )
}