import React from "react";
import Rate from "../Rate";
import styles from "./SubmissionItem.module.css";

const SubmissionItem = ({ email, name, score, completedDate, rating }) => {
  return (
    <div className={styles.container}>
      <p>{email}</p>
      <p>{name}</p>
      <p>{score}</p>

      <p style={!completedDate ? { color: "red" } : {}}>
        {completedDate
          ? new Date(completedDate).toLocaleDateString("en-GB")
          : "Incomplete"}
      </p>

      <Rate rating={rating} isLocked={true} />
    </div>
  );
};

export default SubmissionItem;
