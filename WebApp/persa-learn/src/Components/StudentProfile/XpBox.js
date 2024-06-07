import React from "react";
import styles from "./XpBox.module.css";

const XpBox = ({ xp = 0, requiredXp = 0 }) => {
  return (
    <div className={styles.container}>
      <p>
        {xp}/{requiredXp}xp
      </p>
    </div>
  );
};

export default XpBox;
