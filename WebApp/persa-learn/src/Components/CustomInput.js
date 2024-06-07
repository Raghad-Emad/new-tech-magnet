import React from "react";
import styles from "./CustomInput.module.css";

const CustomInput = ({
  value,
  password = false,
  name,
  setValue,
  placeholder,
  fill = false,
  updateAllValues = false,
  OptionID = false,
}) => {
  return (
    <input
      data-testid="input"
      className={styles.primary}
      placeholder={placeholder}
      style={fill ? { margin: 0, width: "100%" } : {}}
      // {password?}
      value={value}
      type={password ? "password" : "text"}
      name={name}
      onChange={(e) => {
        if (!updateAllValues) {
          setValue(e.target.value);
        } else {
          if (OptionID === false) {
            setValue(e.target.value);
            updateAllValues();
          } else {
            setValue(e.target.value);
            updateAllValues(OptionID, e.target.value);
          }
        }
      }}
    />
  );
};

export default CustomInput;
