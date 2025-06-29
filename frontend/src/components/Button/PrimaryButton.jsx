import React from 'react'

export default function PrimaryButton({ textLabel, onClick }) {
  const style = {
    padding: '10px 20px',
    borderRadius: '6px',
    backgroundColor: '#2563eb', // azul-600
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = '#1d4ed8' // azul-700
  }

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = '#2563eb'
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
