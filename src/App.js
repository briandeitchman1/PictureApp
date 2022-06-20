

import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Button from './components/Button';
import Screen from './components/Screen';
import History from './components/History';
import {v4} from 'uuid';
import { useState,useEffect } from "react"


const LOCAL_STORAGE_KEY = 'calc.answers'



function App() {

  const [operations, setOperations] = useState([""])
  const [answers,setAnswers] = useState([""])



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
  const parenHelper = (numArray,op,prev,num)=>{
    //case where we need to add * before (
    if(isNumber(prev) && op=='('){
      numArray.push(num);
      numArray.push('*');
      numArray.push(op);
      return '';
    }
    //case where we need to add * after )
    if(isNumber(op)&& prev==')'){
      numArray.push('*');
      return num+=op;
    }
    //case where we need to push num before ( or )
    if(num!=''){
      numArray.push(num);
     
    }
    // case where num is '' so we dont push num
    numArray.push(op);
    return '';
  }
  // makes 1-2 into 1 + -2. makes negative numbers work.
  const negativeHelper = (numArray,prev,op,num)=>{
  // It wont add a plus if the prev is ( so 2(-2) wont become 2(+-2)
    if(!isOperation(prev)&&prev!=''&&prev!='('){
      numArray.push(num);
      numArray.push('+');
      num = ''
    }
    return num+=op
  }
  const operatorHelper = (numArray,op,num)=>{
    if(!isNumber(op)&&op!='.'){
      if(num!=''){
        numArray.push(num);
       }
       numArray.push(op);
       return '';
     }
     else{
       return num+=op;
     }
  }
  // converts normal math notation into something that can then be converted 
  // into postfix notation and combines the array of digits into numbers.
  // for example [5,(,6,),] to [5,*,(,6,)] and [(,2,),3] to [(,2,),*,3,]
  // and [1,-,2] -> [1,+,-2]. [-,2,(,2,)] ->[-2,*,(,2,)] 
  const joinNumbers = (numberArray)=>{
    let number='';
    let prev ='';
    operations.forEach(operation=>{
      //deals with parentheses so they work with multiplication
      if(operation == '('|| operation == ')'|| prev == ')'){
        number = parenHelper(numberArray,operation,prev,number);
      }else
      // lets the number be negative
      if(operation == '-' ){
        number = negativeHelper(numberArray,prev,operation,number);
      }
      // deals with the rest
      else{
        number = operatorHelper(numberArray,operation,number);
      }
      prev = operation;
    })
    // push the last number on the the array
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
  //actually does the adding subtracting ect
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
      // always push numbers onto the q
      if(isNumber(num)){
        q.push(num);
      }else{
        //always push ( onto the stack
        if(num == '('){
          stack.push(num);
        }
        // when we get ) push everything from stack onto the q
        // until we hit the closing (
        if(num == ')'){

          let op = stack.pop();
          while(op!='('){
            q.push(op);
            op = stack.pop();
          }
        }
        // if we have a * or / on the stack and run into + or -
        // we need to pop off all * and / then we can push + or -
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
        // the only other symbols are * and / we just push them
        stack.push(num);
        }
        if(num == '*'|| num == '/'){
          stack.push(num);
        }
      }
    })
    // push anything left on the stack to the q
    while(stack.length>0){
      q.push(stack.pop());
    }
    console.log(q);
  } 
// this solves the postfix notation array created from toPostFix function
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
// calls all the functions needed to take the array of digits and symbols
// and convert it into the solution and prints the solution to the screen
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
    setAnswers([...answers, {id:v4(), answer:result.toString()}])
   
  }
//lets the user type instead of clicking buttons
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

  const insertOldAnswer = (answer)=>{
    console.log(answer.target.innerText);
    setOperations([answer.target.innerText]);
  }
  const clearHistory = ()=>{
    setAnswers([])
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
      <h3>Answer History</h3>
      <p>Click to go back to that answer</p>
      <History answers={answers} onClick={insertOldAnswer}/>
      <Button text='Clear History' color="red"onClick={clearHistory}/>
      <Footer />
    </div>
  );
}

export default App;
