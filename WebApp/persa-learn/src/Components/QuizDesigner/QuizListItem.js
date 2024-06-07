import React from "react";
import {
  MdQueryStats,
  MdAdd,
  MdDelete,
  MdModeEdit,
  MdClose,
} from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";

import styles from "./QuizListItem.module.css";
import ToolTip from "../../Components/ToolTip";
import { useNavigate } from "react-router-dom";

const QuizListItem = ({
  id,
  name,
  module = "place holder",
  numQuest = "place holder",
  dueDate = "",

  assignToClass,
  unassignFromClass,
  deleteQuiz,
  classID,
  className,
}) => {
  const navigate = useNavigate();

  return (
    // <div className="quiz-list-items quiz-cols">
    <div className={styles.quiz_cols}>
      <p>{name}</p>
      <p className={styles.module}>{module}</p>
      {/* <p className={styles.num_quest}>{numQuest}</p> */}
      <p className={styles.num_quest}></p>
      <div className={styles.icon}>
        <ToolTip
          Icon={IoStatsChart}
          action={() =>
            navigate("/Assign/submissions", {
              state: { quizID: id, classID, className },
            })
          }
          id={id}
          text={"View Class Submissions"}
        />
        <ToolTip
          Icon={MdAdd}
          action={assignToClass}
          id={id}
          text={"Assign to class"}
        />
        <ToolTip
          Icon={MdModeEdit}
          action={() =>
            navigate("/designer_quiz/edit", {
              state: { quizID: id, selectedClass: { classID, className } },
            })
          }
          id={id}
          text={"Edit Quiz"}
        />
        <ToolTip
          Icon={MdClose}
          action={unassignFromClass}
          id={id}
          text={"Cancel assignment"}
        />
        <ToolTip
          Icon={MdDelete}
          action={deleteQuiz}
          id={id}
          text={"Delete Quiz"}
        />
        {/* <div className="tooltip">
          <MdAdd onClick={() => assignToClass(id)} />
          <span className="tooltiptext">Assign to class</span>
        </div>
        <div className="tooltip">
          <MdDelete onClick={() => deleteQuiz(id)} />
          <span className="tooltiptext">Delete Quiz</span>
        </div> */}
        {/* <MdDelete /> */}
      </div>
      {/* <p>place holder</p> */}
      <p>{dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : ""}</p>
    </div>
  );
};

export default QuizListItem;
