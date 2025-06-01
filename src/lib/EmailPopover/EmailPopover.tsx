import React, { useState } from "react"

type ChildProps = {
  validate: (
    field: string,
    getValues: (text: string) => string,
    setError: any,
    clearErrors: any
  ) => void
  visible: (show: boolean) => void 
}

type Props = {
  children: (props: ChildProps) => React.ReactNode
}

export default function EmailPopover(props: Props) {
  let [isVisible, setIsVisible] = useState(false)
  let [rule, setRule] = useState(false)
  
  const RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

  const validate = (
    field: string,
    getValues: (text: string) => string,
    setError: any,
    clearErrors: any
  ) => {
    let valid: boolean = true
    const value = getValues(field)   

    // rule 
    const matches = value.match(RegExp) || [];
    if (matches.length >= 1) {
      setRule(true)
    } else {
      setRule(false)
      valid = false
    }

    if (!valid) {
      setError(field, {
        type: "manual",
        message: " Pasword Doesn't Meet Requirements",
      })
      setIsVisible(true)
    } else {
      clearErrors(field)
      setIsVisible(false)
    }
  }

  const visible = (b: boolean) => {
    setIsVisible(b)
  }

  return (
    <div
      className={`popover__wrapper ${isVisible === true ? "open" : "close"}`}
    >
      {props.children({
        validate,
        visible
      })}
      <div className="popover__content">
        <div className="popover__message">         
          <ul className='popover__message__ul'>
            <li className={rule === true ? "line" : ""} style={{color: 'red'}}>Email invalid </li>            
          </ul>
        </div>
      </div>
    </div>
  )
}