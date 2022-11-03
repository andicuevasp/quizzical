import React from "react"
import he from 'he';


export default function Question(props) {

 
 const answerElement = props.question.answers.map( answer=> {
    //the answer button is conditionally styled
     const checkSelected = answer.isSelected ? "selected" :"unselected";
    
      function checkCorrect() {
          if(answer.isCorrect && answer.isSelected){
              return "correct"
          } else if(!answer.isCorrect && answer.isSelected){
              return "incorrect"
          } else if(answer.isCorrect && !answer.isSelected){
              return "correct"
          } else if(!answer.isCorrect && !answer.isSelected){
              return "unselected"
          }  
      }             
         
      return (
          <button className={props.showAnswers ? checkCorrect() : checkSelected} key={answer.text} onClick={()=> props.selectAnswer (props.question.id,answer.text)}>{he.decode(answer.text)}</button>
      )
  })
 
 return(
     <div>
        <h2>{he.decode(props.question.questionText)}</h2>
        {answerElement}
        <hr/>
     </div>
 )

    
}