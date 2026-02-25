import React, { useState } from 'react'

export const ReverseInput: React.FC = () => {
  const [input, setInput] = useState('')
  let dot = ''

  const mirrorText = (text: string) => {
    if (text.length === 0) return ''

    if (text.slice(-1) === '.') {
      dot = '.'
      text = text.slice(0, -1)
    }
    const reversed = [...text].reverse().join('')

    if (dot === '.') {
      return reversed[0].toUpperCase() + reversed.slice(1).toLowerCase() + dot
    } else {
      return reversed[0].toUpperCase() + reversed.slice(1).toLowerCase()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '90%',
        padding: '30px',
        margin: '0 auto',
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите текст"
      />
      <p style={{ paddingBottom: '50px' }}>Отзеркалено: {mirrorText(input)}</p>
    </div>
  )
}
