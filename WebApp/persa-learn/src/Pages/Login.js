import React, { useState } from "react";
import LoginBox from "../Components/Login/LoginBox";
import SignUpBox from "../Components/Login/SignUpBox";
import ToggleSwitch from "../Components/ToggleSwitch";

import logo from "../assets/Logo.jpg";
import learning from "../assets/learning.jpg";

import styles from "./Login.module.css";
import CustomButton from "../Components/CustomButton";

const Login = ({ setToken }) => {
  const [signUp, setSignUp] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="" data-testid="login">
      <div className={styles.container}>
        <div className={styles.right_box}>
          <img src={logo} alt="User icon" />
          {isAdmin ? (
            <></>
          ) : (
            <ToggleSwitch
              name="toggleTeacher"
              checked={isTeacher}
              onChange={setIsTeacher}
              yes="teacher"
              no="student"
            />
          )}

          {!signUp ? (
            <>
              <LoginBox
                setToken={setToken}
                isAdmin={isAdmin}
                isTeacher={isTeacher}
                signUp={() => setSignUp(!signUp)}
              />
              {isAdmin ? (
                <CustomButton
                  text={"Back"}
                  type={2}
                  onClick={() => setIsAdmin(false)}
                />
              ) : (
                <CustomButton
                  text={"Admin Login"}
                  type={2}
                  onClick={() => setIsAdmin(true)}
                />
              )}
            </>
          ) : (
            <SignUpBox
              setSignUp={setSignUp}
              isTeacher={isTeacher}
              toggleSignUp={() => setSignUp(!signUp)}
            />
          )}
          
        </div>
        <div className={styles.left_box}>
        <img src={learning} alt="User icon" />
        </div>
      </div>
    </div>
  );
};

export default Login;
