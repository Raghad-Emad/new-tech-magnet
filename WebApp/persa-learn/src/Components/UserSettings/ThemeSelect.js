import React from "react";
import styles from "./ThemeSelect.module.css";

const ThemeSelect = ({
  id,
  name,
  selected,
  primaryColor,
  backgroundColor,
  isDark,
  themeSelected,
  btnTextColor,
}) => {
  return (
    <div
      className={styles.theme_container}
      style={selected ? { border: "1px solid green" } : {}}
      onClick={() =>
        themeSelected(id, backgroundColor, primaryColor, btnTextColor, isDark)
      }
    >
      <div
        className={styles.primary_color}
        style={{ backgroundColor: primaryColor }}
      >
        <div
          className={styles.background_color}
          style={{ backgroundColor: backgroundColor }}
        >
          <p
            className={styles.text_color}
            style={{
              color: isDark == true || isDark == "true" ? "white" : "black",
            }}
          >
            abc
          </p>
          <p
            className={styles.hidden}
            style={
              isDark == true || isDark == "true"
                ? {
                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                    color: "black",
                  }
                : {}
            }
          >
            Select
          </p>
        </div>
      </div>
      {name}
    </div>
  );
};

export default ThemeSelect;
