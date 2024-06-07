import React, { useEffect, useState } from "react";

import QuizBox from "../../Components/Quiz/QuizBox";
import Progressbar from "../../Components/QuizDetails";
// import tempQuizData from "../../assets/tempQuizData.json";
import { checkAnswers, getQuiz } from "../../http_Requests/userRequests";
import { useLocation, useNavigate } from "react-router-dom";
import Overlay from "../../Components/Quiz/Overlay";
import styles from "./Quiz.module.css";
import CustomButton from "../../Components/CustomButton";

const Quiz = () => {
  const [quizID, setQuizID] = useState();
  const [title, setTitle] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [isComplete, setIsComplete] = useState(false);

  // overlay states
  const [earnedXp, setEarnedXp] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [remainingXp, setRemaining] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  // data passed from previous page (quiz id)
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(async () => {
    // get quiz data
    if (state !== null) {
      const data = await getQuiz(state.quizID);

      // console.log(data);
      if (data.status === "success") {
        //set quiz title
        console.log("aaa", data.quiz);
        setTitle(data.quiz.quizName);
        setQuizID(data.quiz.quizID);
        setQuestions(data.quiz.questions);
        console.log(data.quiz);
      }
    }
  }, []);

  const addAnswer = (questionID, answerIdx) => {
    let isFound = false;
    // check if question already answered
    answers.map((ans) => {
      if (ans.questionID == questionID) {
        ans.ans = answerIdx;
        isFound = true;
      }
    });
    if (isFound) {
      //update answers
      setAnswers([...answers]);
    } else {
      // add new answer
      setAnswers([...answers, { questionID, ans: answerIdx }]);
    }
  };
  const complete = async () => {
    console.log("answers", answers);
    // check if all questions answered
    if (answers.length === questions.length) {
      //check answers and submit
      try {
        const data = await checkAnswers({ quizID, answers });
        console.log("data: ", data);
        //set values for overlay
        setScore(answers.length - data.wrongAnswers.length);
        setEarnedXp(data.xp);
        setEarnedCoins(data.coins);
        setLevel(data.level);
        setTotalXp(data.totalXp);
        setRemaining(data.remainingXp);
        setIsComplete(true);
      } catch (e) {}
    } else alert("answer all the questions");
  };

  return (
    <div className="content-box">
      <h1>{title}</h1>
      {/* <div className="container wide-container center-container"> */}
      <div className={styles.container}>
        <Progressbar
          progress={answers.length}
          numQuestions={questions.length}
        />
        {questions.map((question) => {
          return (
            <QuizBox
              key={question.QuestionID}
              questionId={question.QuestionID}
              question={question.Question}
              details={question.Details}
              options={question.options}
              answers={answers}
              addAnswer={addAnswer}
            />
          );
        })}
      </div>

      <CustomButton text={"Complete"} onClick={() => complete()} />
      {isComplete ? (
        <Overlay
          quizID={quizID}
          score={score}
          answers={answers}
          level={level}
          earnedXp={earnedXp}
          earnedCoins={earnedCoins}
          totalXp={totalXp}
          remainingXp={remainingXp}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Quiz;
