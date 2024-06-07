import React from "react";
import styles from "./ToolTip.module.css";

const ToolTip = ({ Icon, text, action, id }) => {
  const iconId = text.replace(/\s/g, "");
  return (
    <div className={styles.tooltip}>
      <Icon id={iconId} onClick={() => action(id)} />
      <span className={styles.tooltiptext}>{text}</span>
    </div>
  );
};

export default ToolTip;
