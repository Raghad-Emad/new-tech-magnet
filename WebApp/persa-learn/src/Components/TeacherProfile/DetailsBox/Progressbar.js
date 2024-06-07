import React from "react";
import styles from "./Progressbar.module.css";
const Progressbar = ({ complete = 0, incomplete = 0 }) => {
  const calcPerIncomplete = () => {
    if (
      complete == null ||
      incomplete == null ||
      (complete == 0 && incomplete == 0)
    )
      return 0;
    return (incomplete / (complete + incomplete)) * 100;
  };
  return (
    <>
      <div className={styles.progressbar}>
        <div
          className={styles.bar_fill_left}
          style={{ width: `${100 - calcPerIncomplete()}%` }}
        >
          <p className={styles.text}>{complete}</p>
        </div>
        <div
          className={styles.bar_fill_right}
          style={{ width: `${calcPerIncomplete()}%` }}
        >
          <p className={styles.text}>{incomplete}</p>
        </div>
      </div>
      <div className={styles.key}>
        <div className={styles.item}>
          <div
            className={styles.color}
            style={{ backgroundColor: "green" }}
          ></div>
          Complete
        </div>
        <div className={styles.item}>
          <div
            className={styles.color}
            style={{ backgroundColor: "red" }}
          ></div>
          Incomplete
        </div>
      </div>
    </>
  );
};

export default Progressbar;
