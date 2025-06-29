import React from 'react'

export default function SecondaryButton({ textLabel, onClick }) {
  const style = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: '2px solid #2563eb',
    backgroundColor: 'transparent',
    color: '#2563eb',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = '#e0edff' // leve azul
  }

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = 'transparent'
  }

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {textLabel}
    </button>
  )
}
