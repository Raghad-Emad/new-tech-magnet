import React, { useState, useEffect } from "react";
import styles from "./LevelProgressbar.module.css";

const LevelProgressbar = ({ earnedXp, totalXp, remainingXp }) => {
  //   let barWidth = 0;
  const calcWidth = (tXp, rXp) => {
    if (tXp == null || rXp == null || rXp == 0) return 100;

    const width = (tXp / rXp) * 100;

    if (width > 100) return 100;

    return (tXp / rXp) * 100;
  };
  const [barWidth, setBarWidth] = useState(
    calcWidth(totalXp - earnedXp, remainingXp)
  );
  const [maxbarWidth, setMaxBarWidth] = useState(
    calcWidth(totalXp, remainingXp)
  );
  console.log(barWidth);
  // console.log(calcWidth());
  useEffect(() => {
    setBarWidth(calcWidth(totalXp, remainingXp));
  }, []);
  //   setBarWidth(calcWidth());
  return (
    <div className={styles.container}>
      <p className={styles.required}>
        {totalXp}/{remainingXp}
      </p>
      <div className={styles.progressbar}>
        <div
          className={styles.bar_fill2}
          style={{ width: `${maxbarWidth}%` }}
        ></div>
        <div
          className={styles.bar_fill}
          style={{ transition: "all 500ms", width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LevelProgressbar;
