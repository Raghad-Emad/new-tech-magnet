import React from "react";
import styles from "./LeaderboardStudent.module.css";

const LeaderboardStudent = ({ name, icon, xp, position, level }) => {
  return (
    <div className={styles.leaderboard_student}>
      <p>{position}</p>
      <div
        style={{ backgroundImage: `url(${icon})`, backgroundSize: "cover" }}
        className={styles.image}
      ></div>
      <p>{name}</p>
      <p>Lv{level}</p>
      <p>{xp}xp</p>
    </div>
  );
};

export default LeaderboardStudent;
