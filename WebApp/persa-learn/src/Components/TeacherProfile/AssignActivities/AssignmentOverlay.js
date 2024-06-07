import React from "react";
import styles from "./AssignmentOverlay.module.css";
import DatePicker from "react-datepicker";
import CustomButton from "../../CustomButton";
import CustomInput from "../../CustomInput";

const AssignmentOverlay = ({
  dueDate,
  setDueDate,
  setXp,
  setCoins,
  submitAssignToClass,
  setSettingDate,
  dueDateError,
  xpError,
  coinsError,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>Assign module</h1>
        <div className={styles.error}>{dueDateError}</div>
        <DatePicker
          className={styles.primary}
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Due date"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          styles
        />
        <div className={styles.error}>{xpError}</div>
        <CustomInput placeholder={"Xp"} setValue={setXp} />
        <div className={styles.error}>{coinsError}</div>
        <CustomInput placeholder={"Coins"} setValue={setCoins} />
        {/* <input placeholder="xp" onChange={(e) => setXp(e.target.value)} />
        <input placeholder="coins" onChange={(e) => setCoins(e.target.value)} /> */}
        {/* <button className="btn" onClick={() => submitAssignToClass()}>
          Ok
        </button>

        <button
          className="btn"
          onClick={() => {
            setSettingDate(false);
          }}
        >
          Back
        </button> */}
        <CustomButton text={"Ok"} onClick={() => submitAssignToClass()} />
        <CustomButton
          text={"Back"}
          type={2}
          onClick={() => {
            setSettingDate(false);
          }}
        />
      </div>
    </div>
  );
};

export default AssignmentOverlay;
