import React from "react";
import styles from "./DetailsBox.module.css";

const DetailsBox = ({ username, coins }) => {
  return (
    <div className={styles.detail_box}>
      
      <div className={styles.name_box}>
        <p data-testid="firstlast">{username}</p>
      </div>
      <div className={styles.box}>
        <p>{coins} Coins</p>
      </div>
    </div>
  );
};

export default DetailsBox;
