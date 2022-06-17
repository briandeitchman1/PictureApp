

import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import Screen from './components/Screen';
import { useState } from "react"






function App() {

  const [operations, setOperations] = useState([""])
  // adds a number as a string to the operations
  const addNumber = (e)=>{
    console.log(e.target.innerText)
    setOperations( prevOperations =>{
      return [...prevOperations,e.target.innerText]
    })
  }
  // will only add an operator(+,-,*,/) if the last operation was a number
  // If the last operation was a operator(+,-,*,/) it will change to the new 1
  const addOperator = (e)=>{
    const newOp  = e.target.innerText;
    const lastOp = operations[operations.length-1];
    console.log(lastOp)
    if(lastOp >= '0'&& lastOp<= '9')
    {
      console.log('yo')
      setOperations( prevOperations =>{
        return [...prevOperations,e.target.innerText]
      })
      return
    }
    setOperations(prevOperations =>{
      return  [prevOperations.slice(0,prevOperations.length-1),newOp];
    })

  }
  
  const joinNumbers = (numberArray)=>{
    let number="";
    operations.forEach(operation=>{
      console.log(operation + "hi")
      if(!isNumber(operation)){
        numberArray.push(number);
        numberArray.push(operation);
        number ="";
      }
      else{
        number+=operation;
      }
    })
    numberArray.push(number);
    return numberArray
  }
  const isNumber = (num)=>{
    if (num>="0"&&num<="9") {
      return true;
    }
    return false;
  }
  const isOperation = (op)=>{
    if(op === '+'||op === '-'|| op ==='*'|| op === '/'){
      return true;
    }
    return false;
  }
  const doOperation = (num1,op,num2)=>{
    let result;
    switch(op){
      case "+": result = num1 + num2;
                break; 
      case "-": result = num1 - num2;
                break; 
      case "*": result = num1 * num2;
                break; 
      case "/": result = num1 / num2;
                break; 
    }
    return result;
  }
  const doMath = ()=>{
    //console.log(operations)

    const numberArray =[]
    joinNumbers(numberArray);
    console.log(numberArray);
    let result = 0;
    let i = 0;
    let op ="";
    while( i < numberArray.length){
      let num1 = parseInt(numberArray[i]);
      i++;
      op = numberArray[i]
      i++;
      let num2 = parseInt(numberArray[i])
      i++;
      result+= doOperation(num1,op,num2);

    }
   
    
    setOperations(result?[result]:[])
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
      <Button  text='+' onClick={addOperator} />
      <Button  text='-' onClick={addOperator} />
      <Button  text='/' onClick={addOperator} />
      <Button  text='*' onClick={addOperator} />
      <Button  text='=' onClick={doMath} />

      

      <Footer />
    </div>
  );
}

export default App;
