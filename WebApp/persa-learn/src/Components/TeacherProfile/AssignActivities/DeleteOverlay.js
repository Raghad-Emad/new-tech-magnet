import React from "react";
import CustomButton from "../../CustomButton";
import styles from "./DeleteOverlay.module.css";

const DeleteOverlay = ({ setIsDelete, deleteNow }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>Are you sure you want to delete this assignment?</h1>
        {/* <button className="btn" onClick={() => deleteNow()}>
          Yes
        </button>
        <button
          className="btn"
          onClick={() => {
            setIsDelete(false);
          }}
        >
          No
        </button> */}
        <CustomButton text={"Yes"} onClick={() => deleteNow()} />
        <CustomButton
          text={"Back"}
          type={2}
          onClick={() => {
            setIsDelete(false);
          }}
        />
      </div>
    </div>
  );
};

export default DeleteOverlay;
