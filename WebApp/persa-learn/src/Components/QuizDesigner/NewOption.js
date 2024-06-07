import React, { useState, useEffect } from "react";
import CustomInput from "../CustomInput";
import styles from "./NewOption.module.css";

import { MdClose } from "react-icons/md";

const NewOption = ({
  opID,
  updateOption,
  correctAns,
  updateCorrectAns,
  value,
  removeOption,
}) => {
  const [option, setOption] = useState(value);
  useEffect(() => {
    console.log("the value changed");
    setOption(value);
  }, [value]);
  return (
    // <div className="new-option">
    <div className={styles.new_option}>
      {/* <input
        placeholder="enter option"
        onChange={(e) => {
          setOption(e.target.value);
          updateOption(opID, e.target.value);
        }}
      /> */}
      <CustomInput
        placeholder={"Option"}
        value={option}
        setValue={setOption}
        updateAllValues={updateOption}
        OptionID={opID}
        fill={true}
      />
      {/* act as tick box */}
      <div
        // className="check-box"
        className={styles.check_box}
        aria-selected={correctAns}
        id={"checkbox"}
        onClick={() => {
          // updateCorrectAns(opID);
          updateCorrectAns(option);
        }}
      ></div>
      <div className={styles.delete_box} onClick={() => removeOption(opID)}>
        <MdClose />
      </div>
    </div>
  );
};

export default NewOption;
