

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
  const reset = ()=>{
    setOperations([]);
  }
  const backspace = ()=>{
    if(operations.length == 0){
      return;
    }
    
    let result =[...operations];
    result= result.slice(0, result.length-1);
    setOperations([result])
  }
  // will only add an operator(+,-,*,/) if the last operation was a number
  // If the last operation was a operator(+,-,*,/) it will change to the new 1
  const addOperator = (e)=>{
    const newOp  = e.target.innerText;
    const lastOp = operations[operations.length-1];
    console.log(lastOp)
    if((lastOp >= '0'&& lastOp<= '9') || lastOp == '(' || lastOp == ')'||lastOp == '-')
    {
      console.log(newOp)
      setOperations( prevOperations =>{
        return [...prevOperations,newOp]
      })
      return
    }
    setOperations(prevOperations =>{
      return  [prevOperations.slice(0,prevOperations.length-1),newOp];
    })

  }
  // converts normal math notation into something that can
  // then be converted into postfix notation
  // for example 5(6) to 5*(6) and (2)3 to (2)*3
  // and 1-2 -> 1 + -2 
  const joinNumbers = (numberArray)=>{
    let number='';
    let prev ='';
    operations.forEach(operation=>{
      if(isNumber(prev) && operation=='(' ){
        numberArray.push(number);
        numberArray.push('*');
        numberArray.push(operation)
        number=''
      }else
      if(isNumber(operation) && prev==')'){
        numberArray.push('*');
        number+=operation
      }
      else
      // lets the number be negative
      if(operation == '-' ){
        if(!isOperation(prev)&& prev!=''&&prev!='('){
          console.log("yo")
          numberArray.push(number);
          numberArray.push('+')
          number = ''
        }
        number+= operation;
      }else
      if(!isNumber(operation)&&operation!='.'){
       if(number!=''){
         numberArray.push(number);
        }
        numberArray.push(operation);
        number ='';
      }
      else{
        number+=operation;
      }
      prev = operation;
    })
    if(number!=''){
      numberArray.push(number);
    }
    return numberArray
  }
  // returns true if the array is a number
  // checks if a number is negative too
  const isNumber = (num)=>{
    if (num>="0"&&num<="9" || num[0]=='-') {
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
    
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
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
  
  // checks for correct number of parentheses
  const isBalanced = (nums)=>{
   const stack = [];

   for(let i = 0; i < nums.length; i++){
    let c = nums[i];
    if(c == '('){
      stack.push('(')
    }
    if(c == ')'){
      if(stack.length == 0){
        return false;
      }
      stack.pop();
    }
   }
   return stack.length == 0;
  }

  const invalidFormat = () =>{
    console.log("invalid format");
    setOperations([]);
  }
  // uses the shunting yard algorithm to convert from 
  // infix notation to postfix or reverse polish notation
  const toPostFix = (nums,q)=>{
    const stack = [];

    nums.forEach(num =>{
      if(isNumber(num)){
        q.push(num);
      }else{
        if(num == '('){
          stack.push(num);
        }
        if(num == ')'){

          let op = stack.pop();
          while(op!='('){
            q.push(op);
            op = stack.pop();
          }
        }
        if(num == '+' || num == '-'){
         let top = stack.length-1;
         while(stack.length){
          console.log("stack")
         if( stack[top] == '*' || stack[top] == '/'){
          let op = stack.pop();
          q.push(op);
          top--;
         }
         else{
          break;
         }
        }
        stack.push(num);
        }
        if(num == '*'|| num == '/'){
          stack.push(num);
        }
      }
    })
    while(stack.length>0){
      q.push(stack.pop());
    }
    console.log(q);
  } 

  const solve = (q)=>{
    const stack = [];
    q.forEach(x=>{
      if(isNumber(x)){
        stack.push(x);
      }
      else{
        let num2 = stack.pop();
        let num1 = stack.pop();
        stack.push(doOperation(num1,x,num2));
      }

    })
    return stack.pop();
  }

  const doMath = ()=>{
    const numberArray =[]
    joinNumbers(numberArray);
    console.log(numberArray);
    if(!isBalanced(numberArray)){
      invalidFormat();
    }
    const q = []
    toPostFix(numberArray,q);
    console.log(q);
    let result =  solve(q);
    setOperations([result.toString()])
  }

  const  keyPressHandler = (event)=>{
    console.log(event.key.toString())
    let x = event.key.toString();
    if(isNumber(x)||isOperation(x)|| x =='('||x ==')'){
      setOperations( prevOperations =>{
        return [...prevOperations,x]
      })
    }
    if(x === "Backspace"){
      backspace();
    }
    if(x === "Enter"){
      doMath();
    }
  }

  return (
    <div className='container' id="container" tabIndex="0"  onKeyDown={keyPressHandler}>
      <Header />
      <Screen operations={operations} />
      <div className="row">
        <div className="col">
        <Button  text='1' onClick={addNumber}/>
        <Button  text='2' onClick={addNumber}/>
        <Button  text='3' onClick={addNumber}/>
        <Button  text=')' onClick={addNumber}/>
        <Button  text='.' onClick={addNumber}/>
        </div>
      
      </div>
      <div className="row">
        <div className="col">
        <Button  text='4' onClick={addNumber}/>
      <Button  text='5' onClick={addNumber}/>
      <Button  text='6' onClick={addNumber}/>
      <Button  text='(' onClick={addNumber}/>
      <Button  text='=' onClick={doMath} />
        </div>
      </div>
      <div className="row">
        <div className="col">
        <Button  text='7' onClick={addNumber}/>
      <Button  text='8' onClick={addNumber}/>
      <Button  text='9' onClick={addNumber}/>
      <Button  text='*' onClick={addOperator} />
      <Button  text='Reset' color="red" onClick={reset}/>
        </div>
      </div>
      
      <Button  text='0' onClick={addNumber}/>
      <Button  text='+' onClick={addOperator} />
      <Button  text='-' onClick={addNumber} />
      <Button  text='/' onClick={addOperator} />
      
      <Button  text='BackSpace' color="blue" onClick={backspace}/>


      

      <Footer />
    </div>
  );
}

export default App;
