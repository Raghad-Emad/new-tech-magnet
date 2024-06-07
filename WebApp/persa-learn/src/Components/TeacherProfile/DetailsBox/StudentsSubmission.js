import React from "react";
import Rate from "../../Rate";
import styles from "./StudentsSubmission.module.css";

const StudentsSubmission = ({
  name,
  score = 0,
  total,
  completedDate,
  rating,
}) => {
  if (score == null) {
    score = 0;
  }
  return (
    <div className={styles.container}>
      <p>{name}</p>
      <p>
        {score}/{total}
      </p>

      <p style={!completedDate ? { color: "red" } : {}}>
        {completedDate
          ? new Date(completedDate).toLocaleDateString("en-GB")
          : "Incomplete"}
      </p>

      <Rate rating={rating} isLocked={true} isCentered={false} />
    </div>
  );
};

export default StudentsSubmission;
