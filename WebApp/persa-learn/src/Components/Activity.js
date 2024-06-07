import React from "react";

import icon from "../assets/undraw_questions_re_1fy7.svg";

const Activity = ({ name = "activity" }) => {
  return (
    <div className="activity-box">
      <img src={icon} alt="quiz icon" />
      <h2>{name}</h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti at
        expedita porro cupiditate veniam quas.
      </p>
    </div>
  );
};

export default Activity;
