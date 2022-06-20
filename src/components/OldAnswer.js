import React from 'react'

const OldAnswer = ({answer,onClick}) => {
  return (
    <p onClick={onClick}>{answer.answer}</p>
  )
}

export default OldAnswer