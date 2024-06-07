import React from "react";
import styles from "./Theme.module.css";

const Theme = ({
  id,
  name,
  details,
  primaryColor,
  backgroundColor,
  btnTextColor,
  isDark,
  cost,
  requiredLevel,
  selectTheme,
}) => {
  return (
    <div
      className={styles.color_container}
      onClick={() =>
        selectTheme(
          id,
          name,
          details,
          primaryColor,
          backgroundColor,
          btnTextColor,
          isDark,
          cost,
          requiredLevel
        )
      }
    >
      <div
        className={styles.primary_color}
        style={{ backgroundColor: primaryColor }}
      >
        <div
          className={styles.secondary_color}
          style={{ backgroundColor: backgroundColor }}
        >
          <p
            className={styles.text_color}
            style={{ color: isDark ? "white" : "black" }}
          >
            abc
          </p>
          <p
            className={styles.hidden}
            style={
              isDark
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
      <p>{name}</p>
    </div>
  );
};

export default Theme;
