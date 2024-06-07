import React from "react";
import CustomButton from "../CustomButton";
import styles from "./OverlayError.module.css";
const Overlay = ({ setIsError, close }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>An error occured quiz not created</h1>
        <CustomButton text={"Ok"} onClick={close} />
      </div>
    </div>
  );
};

export default Overlay;
