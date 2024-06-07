import React from "react";
import { Link } from "react-router-dom";

// import QuizBox from "../Components/QuizBox";
import Activity from "../Components/Activity";

const Activities = () => {
  return (
    <div className="content-box">
      <h1>Activities</h1>
      <div className="container center-container flex-wrap">
        {/* <Link to="/quiz">
          <Activity name="Quiz" />
        </Link> */}
        <Link to="/flash-cards">
          <Activity name="Flash Cards" />
        </Link>
      </div>
    </div>
  );
};

export default Activities;
