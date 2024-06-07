import React from "react";
import styles from "./UserIcon.module.css";

const UserIcon = ({ level, studentIcon }) => {
  return (
    <div
      className={styles.user_icon}
      style={{
        backgroundImage: `url(${studentIcon})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.xp}>
        <p>Lv{level}</p>
      </div>
    </div>
  );
};

export default UserIcon;
