import React from 'react'

interface FormInputProps {
  id: string
  name: string
  type: 
  | 'text'
  | 'number'
  | 'password'  
  placeholder: string  
  className: string | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value?: any
  required: boolean 
  error: any  
  label: string
  [props: string]: any
}

export const FormInput: React.FC<FormInputProps> = ({
  id, 
  name,
  type,  
  placeholder,  
  className,
  onChange,
  value,
  required, 
  error, 
  label
}) => {  
  
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        id={id}       
        name={name}
        type={type}
        className={className}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required={required}
        autoFocus        
        // style={error && {border: 'solid 1px red'}}
      />
      {/* { error && <p>{ error }</p>} */}
    </>
  )
}