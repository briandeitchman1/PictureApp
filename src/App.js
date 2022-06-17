

import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import Screen from './components/Screen';
import { useState } from "react"






function App() {

  const [operations, setOperations] = useState([1,'+',1])
  const addNumber = (e)=>{
    console.log(e.target.innerText)
    setOperations( prevOperations =>{
      return [...prevOperations,e.target.innerText]
    })
  }
  
  return (
    <div>
      <Header />
      <Screen operations={operations}/>
      <Button  text='1' onClick={addNumber}/>
      <Button  text='2' onClick={addNumber}/>
      <Button  text='3' onClick={addNumber}/>
      <Button  text='4' onClick={addNumber}/>
      <Button  text='5' onClick={addNumber}/>
      <Button  text='6' onClick={addNumber}/>
      <Button  text='7' onClick={addNumber}/>
      <Button  text='8' onClick={addNumber}/>
      <Button  text='9' onClick={addNumber}/>
      <Button  text='0' onClick={addNumber}/>
      <Button  text='+' onClick={addNumber} />
      <Button  text='-' onClick={addNumber} />
      <Button  text='/' onClick={addNumber} />
      <Button  text='*' onClick={addNumber} />

      

      <Footer />
    </div>
  );
}

export default App;
