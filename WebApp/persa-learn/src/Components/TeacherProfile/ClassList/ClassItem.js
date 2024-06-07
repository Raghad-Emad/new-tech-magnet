import React from "react";
import styles from "./ClassItem.module.css";

const ClassItem = ({
  id,
  name = "no name",
  yearGroup = 10,
  overdue = 10,
  setSelectedClass,
  classSelected,
}) => {
  return (
    <div
      // className="task"
      className={styles.task}
      aria-selected={classSelected}
      onClick={() => setSelectedClass({ id, name, yearGroup })}
    >
      <p>{name}</p>
      <p>Year Group: {yearGroup}</p>
      {/* <p>Overdue: {overdue}</p> */}
    </div>
  );
};

export default ClassItem;
