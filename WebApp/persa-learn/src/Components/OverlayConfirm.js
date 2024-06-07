import React from "react";
import CustomButton from "./CustomButton";
import styles from "./OverlayConfirm.module.css";
const OverlayConfirm = ({ message, yes, no, type = 1 }) => {
  return (
    <div className={styles.overlay}>
      {/* <div className="message-box"> */}
      <div className={styles.message_box}>
        <h2>{message}</h2>
        {/* <button className="btn" onClick={yes}>
          yes
        </button>
        <button className="btn" onClick={no}>
          no
        </button> */}
        <CustomButton text={type == 1 ? "Yes" : "Ok"} onClick={yes} />
        {type == 1 ? <CustomButton text={"No"} onClick={no} type={2} /> : <></>}
      </div>
    </div>
  );
};

export default OverlayConfirm;
