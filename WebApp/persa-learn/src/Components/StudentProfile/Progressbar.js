import React from "react";
import styles from "./Progressbar.module.css";
const Progressbar = ({ xp, requiredXp }) => {
  const calcWidth = () => {
    if (xp == null || requiredXp == null || requiredXp == 0) return 100;

    const width = (xp / requiredXp) * 100;

    if (width > 100) return 100;

    return (xp / requiredXp) * 100;
  };
  // console.log(calcWidth());
  const barWidth = calcWidth();
  return (
    <div className={styles.progressbar}>
      <div className={styles.bar_fill} style={{ width: `${barWidth}%` }}></div>
    </div>
  );
};

export default Progressbar;
