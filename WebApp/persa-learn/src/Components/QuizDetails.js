import React, { useState, useEffect } from "react";
import styles from "./QuizDetails.module.css";

const Progressbar = ({ progress = 0, numQuestions }) => {
  const [widthPer, setWidthPer] = useState();
  useEffect(() => {
    let perc = 0;
    if (numQuestions !== 0) perc = `${(progress / numQuestions) * 100}%`;
    setWidthPer(perc);
  }, [progress]);

  return (
    // <div className="progressbar">
    <div className={styles.container}>
      {/* <div className="top"> */}
      <div className={styles.top}>
        <h2>
          Progress: {progress}/{numQuestions}
        </h2>
        {/* <div className="help-box">
          <p>Need help?</p>
          <button className="go-lesson-btn btn">Go to lesson</button>
          <button className="walk-through-btn btn">Walk through</button>
        </div> */}
      </div>
      {/* <div className="bar"> */}
      <div className={styles.progressbar}>
        <div className={styles.barFill} style={{ width: widthPer }}></div>
        {/* <div className="barFill" style={{ width: widthPer }}></div> */}
      </div>
      {/* <p>50%</p> */}
    </div>
  );
};

export default Progressbar;
