import React from "react";
import CustomButton from "../CustomButton";
import styles from "./AlertOverlay.module.css";

const AlertOverlay = ({ message, ok }) => {
  return (
    <div className={styles.overlay}>
      {/* <div className="message-box"> */}
      <div className={styles.message_box}>
        <h1>{message}</h1>
        {/* <button className="btn" onClick={yes}>
          yes
        </button>
        <button className="btn" onClick={no}>
          no
        </button> */}
        <CustomButton text={"Ok"} onClick={ok} />
      </div>
    </div>
  );
};

export default AlertOverlay;
