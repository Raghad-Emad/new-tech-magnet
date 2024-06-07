import React from "react";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import QuizListItem from "./QuizListItem";
import CustomButton from "../CustomButton";

import styles from "./TeachersQuizzes.module.css";

const TeachersQuizzes = ({
  quizzes = [],
  assignToClass,
  unassignFromClass,
  deleteQuiz,
  selectedClass,
  classID,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="quiz-items"> */}
      <div className={styles.quiz_items}>
        {/* <div className="quiz-cols quiz-col-names"> */}
        <div className={styles.quiz_cols}>
          <p>Quiz names</p>
          <p className={styles.module}>Module</p>
          {/* <p className={styles.num_quest}>No. of Questions</p> */}
          <p className={styles.num_quest}></p>
          <p>Options</p>
          <p>Due</p>
        </div>
        {quizzes.map((quiz) => {
          return (
            <QuizListItem
              key={quiz.QuizID}
              id={quiz.QuizID}
              name={quiz.QuizName}
              module={quiz.ModuleName}
              dueDate={quiz.DueDate}
              assignToClass={assignToClass}
              unassignFromClass={unassignFromClass}
              deleteQuiz={deleteQuiz}
              classID={classID}
              className={className}
            />
          );
        })}
        {/* <div
          className="add-quiz"
          onClick={() =>
            navigate("/designer_quiz", {
              state: selectedClass,
            })
          }
        >
          <div className="circle">
            <MdAdd />
          </div>
          <p>Create Quiz</p>
        </div> */}
        <CustomButton
          text={"Create Quiz"}
          type={3}
          onClick={() =>
            navigate("/designer_quiz", {
              state: selectedClass,
            })
          }
        />
      </div>
    </>
  );
};

export default TeachersQuizzes;
