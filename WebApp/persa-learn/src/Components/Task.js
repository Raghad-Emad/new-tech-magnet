import React from "react";

const Task = ({ name = "tempName", progress = 0 }) => {
  return (
    <div className="Task">
      <h2>{name}</h2>
      <p>Progress: {progress}%</p>
    </div>
  );
};

export default Task;
