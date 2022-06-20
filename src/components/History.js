import React from 'react'
import OldAnswer from './OldAnswer'

const History = ({onClick,answers}) => {
  return (

    answers.map((answer,index)=>{
        return <OldAnswer key={index} answer={answer} onClick={onClick}/>
    })
  )
}

export default History