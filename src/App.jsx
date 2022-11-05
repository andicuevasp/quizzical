import React from 'react';
import Question from './components/Question';

export default function App() {
  const [quiz, setQuiz] = React.useState(false);
  const [questionList, setQuestionList] = React.useState([]);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const [count, setCount] = React.useState(0);

  //function taht sets the state for the quiz to start
  function startQuiz() {
    setQuiz((prevQuiz) => !prevQuiz);
  }

  //function to put answers in random order used inside setQuestionList
  function func() {
    return 0.5 - Math.random();
    return;
  }

  React.useEffect(() => {
    //function for retrieving the questions from the API
    async function getQuestion() {
      const res = await fetch(
        'https://opentdb.com/api.php?amount=5&category=11&difficulty=easy&type=multiple'
      );
      const data = await res.json();
      //setting up the questions in the array as objects
      setQuestionList(
        data.results.map((item, index) => {
          return {
            id: index,
            questionText: item.question,
            answers: [
              { text: item.correct_answer, isCorrect: true, isSelected: false },
              ...item.incorrect_answers.map((answer) => {
                return { text: answer, isCorrect: false, isSelected: false };
              }),
            ].sort(func),
            gotScore: false,
          };
        })
      );
    }

    getQuestion();
  }, [count]);

  // checks to see if the answer clicked has been selected
  function selectAnswer(questionId, answerText) {
    setQuestionList((prevQuestList) => {
      const newQuestList = prevQuestList.map((question) => {
        if (questionId === question.id) {
          const newAnsArray = question.answers.map((answer) => {
            if (answerText === answer.text) {
              const selectedAnswer = { ...answer, isSelected: true };
              return selectedAnswer;
            }
            const unSelectedAnswer = { ...answer, isSelected: false };
            return unSelectedAnswer;
          });
          const newQuestion = { ...question, answers: newAnsArray };
          return newQuestion;
        }
        return question;
      });
      return newQuestList;
    });
  }

  //checks to see if the selected answer is correct
  function checkAnswers() {
    setQuestionList((prevQuestList) => {
      const newQuestList = prevQuestList.map((question) => {
        const selectedAnswer = question.answers.find((answer) => {
          return answer.isSelected;
        });
        if (selectedAnswer && selectedAnswer.isCorrect) {
          const rightQuestion = { ...question, gotScore: true };
          return rightQuestion;
        }
        const wrongQuestion = { ...question, gotScore: false };
        return wrongQuestion;
      });
      return newQuestList;
    });
    setShowAnswers(true);
  }

  //array of answers that are correct
  const correctQuestions = questionList.filter((question) => question.gotScore);

  //runs when play again is clicked
  function restartQuiz() {
    setQuestionList([]);
    setShowAnswers(false);
    setCount((count) => count + 1);
  }

  const questionComponent = questionList.map((question) => {
    return (
      <Question
        key={question.id}
        question={question}
        id={question.id}
        selectAnswer={selectAnswer}
        showAnswers={showAnswers}
      />
    );
  });

  // Loading while the questions are being fetched
  if (questionList.length === 0) {
    return (
      <div className="loading">
      <div className="loading__spinner"></div>
      </div>
  )
  }

  return (
    <main>
      <img src="https://github.com/SoulCatcher947/Quizzical-App/blob/main/src/images/yellow-blob.png?raw=true" alt='yellow-blob'  className='yellow-blob'/>
      {!quiz ? (
        <div className='start-page'>
          <h1>Quizzical</h1>
          <h3> 🍿 Test your film knowledge! 🍿 </h3>
          <button className='large-button' onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <div className='question-page'>
          {questionComponent}
          <div className='answer-button-div'>
            {showAnswers && (
              <h3>
                You got {correctQuestions.length}/{questionList.length}{' '}
                questions correct!
              </h3>
            )}
            <button
              className='large-button'
              onClick={showAnswers ? restartQuiz : checkAnswers}>
              {showAnswers ? 'Play Again' : 'Check Answers'}!
            </button>
          </div>
        </div>
      )}
      <img src="https://github.com/SoulCatcher947/Quizzical-App/blob/main/src/images/blue-blob.png?raw=true" alt='pink-blob' className='blue-blob'/>
    </main>
  );
}
