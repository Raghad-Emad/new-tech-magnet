import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AssignmentItem.module.css";

const AssignmentItem = ({
  id,
  assignmentName = "placeholder",
  // assignmentName = "class",
  teacherName = "placeholder",
  taskType = "placeholder",
  ModuleName,
  dueDate,
  Caption,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <div
      key={id}
      className={styles.assignment_item}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      onClick={() =>
        navigate("/quiz", {
          state: {
            quizID: id,
          },
        })
      }
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          navigate("/quiz", {
            state: {
              quizID: id,
            },
          });
        }
      }}
    >
      <p>{assignmentName}</p>
      <p>{className}</p>
      <p>{teacherName}</p>
      <p className={styles.module}>Module: {ModuleName}</p>
      <p>{dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : ""}</p>
    </div>
    // <div
    //   key={id}
    //   className="assignment-item"
    //   onClick={() =>
    //     navigate("/quiz", {
    //       state: {
    //         quizID: id,
    //       },
    //     })
    //   }
    // >
    //   <p>{`Assignment name: ${assignmentName}`}</p>
    //   <p>Type: {Caption}</p>
    //   <p>Teacher: {teacherName}</p>
    //   <p>Module: {ModuleName}</p>
    //   <p>
    //     Due date: {dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : ""}
    //   </p>
    // </div>
  );
};

export default AssignmentItem;
