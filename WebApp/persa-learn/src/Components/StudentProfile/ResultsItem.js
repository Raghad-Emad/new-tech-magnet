import React from "react";
import styles from "./ResultsItem.module.css";

const ResultsItem = ({
  id,
  quizName,
  total,
  className,
  firstname,
  lastname,
  profilePicture,
  score,
  subDate,
}) => {
  return (
    <div className={styles.container} tabIndex={0}>
      {/* <div> */}
      <div className={styles.student_container}>
        <div
          style={{
            backgroundImage: `url(${profilePicture})`,
            backgroundSize: "cover",
          }}
          className={styles.image}
        ></div>
        <p>{`${firstname} ${lastname}`}</p>
      </div>
      <p>
        Scored <span style={{ fontWeight: "bold" }}>{`${score}/${total}`}</span>{" "}
        On {quizName}
      </p>
      <p style={{ fontSize: "1.5rem", margin: 0 }}>🎉🎉🎉</p>
    </div>
  );
};
export default ResultsItem;
