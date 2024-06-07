import React from "react";

import icon from "../assets/undraw_building_blocks_n-0-nc.svg";

const MakeActivity = ({ name = "activity" }) => {
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

export default MakeActivity;
