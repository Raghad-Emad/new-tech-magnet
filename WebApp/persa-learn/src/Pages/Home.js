import React from "react";
import { Link } from "react-router-dom";

import hero from "../assets/undraw_education_f8ru.svg";
import CustomButton from "../Components/CustomButton";
import CustomInput from "../Components/CustomInput";
// import userIcon from "../assets/tempLogo.svg";

// components
import LoginBox from "../Components/Login/LoginBox";

const Home = ({ setToken }) => {
  return (
    <div className="content-box">
      {/* <h1>Home</h1> */}
      <div className="container">
        <div className="left-box">
          <img src={hero} alt="woman stood on book" />
          <h1>Welcome</h1>
          <h2>The new way to learn</h2>
          <Link to="/profile">
            <button id="joinBtn" className="btn">
              Join the Community
            </button>
          </Link>
          <Link to="/leaderboard">
            <button id="joinBtn" className="btn">
              Class leaderboard
            </button>
          </Link>
          {/* <Link to="/achievements">
            <button id="joinBtn" className="btn">
              Achievements
            </button>
          </Link> */}
          <Link to="/profile_student">
            <button id="joinBtn" className="btn">
              Student Profile
            </button>
          </Link>
          <Link to="/profile_teacher">
            <button id="joinBtn" className="btn">
              Teacher Profile
            </button>
          </Link>
          <CustomButton type={1} text={"Primary"} />
          <CustomButton type={2} text={"Secondary"} />
          <CustomButton type={3} text={"Special"} />
          <CustomInput />
        </div>
        <div className="right-box">
          <LoginBox setToken={setToken} />
        </div>
      </div>
    </div>
  );
};

export default Home;
