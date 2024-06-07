import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../http_Requests/userRequests";

import userIcon from "../../assets/tempUserIcon.svg";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";

import styles from "./LoginBox.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginBox = ({ setToken, isTeacher, isAdmin, signUp }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [isError, setIsError] = useState(false);
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  // const [httpResponseCode, setHttpResponseCode] = useState();

  const login = async () => {
    try {
      if (email == null || email == "") {
        setEmailError("Please enter an email");
      } else if (!EMAIL_REGEX.test(email)) {
        setEmailError("Please enter a valid email");
      } else {
        setEmailError(null);
      }
      if (password == null || password == "") {
        setPasswordError("Please enter a password");
      } else if (password.length < 8) {
        setPasswordError("Password must be 8 or more characters");
      } else {
        setPasswordError(null);
      }
      // if (email != null && password != null && email != "" && password != "") {
      if (
        password != null &&
        password != "" &&
        email != null &&
        email != "" &&
        EMAIL_REGEX.test(email) &&
        password.length >= 8
      ) {
        const data = await loginUser(
          {
            email,
            password,
          },
          isTeacher,
          isAdmin
        );
        console.log("data: ", data);

        if (data !== null && data !== undefined) {
          const token = data.token;
          console.log(token);
          if (!token) {
            setIsError(true);
            if (data.reason === "ENOTFOUND" || data.reason === "ECONNREFUSED") {
              setReason("could not connect to db");
              return;
            }
            setReason("Email or Password incorrect");
            return;
          }
          if (isAdmin) {
            sessionStorage.setItem("admin", true);
            sessionStorage.setItem("teacher", false);
          } else if (isTeacher) {
            sessionStorage.setItem("teacher", true);
            sessionStorage.setItem("admin", false);
          } else {
            sessionStorage.setItem("teacher", false);
            sessionStorage.setItem("admin", false);
          }
          setIsError(false);
          navigate("/");
          setToken(token);
        } else {
          console.log("No data returned");
        }
      }
    } catch (e) {
      console.log("error occured: ", e);
    }
  };

  return (
    <>
      {!isAdmin ? (
        <h1 data-testid={"thelogin"}>Login</h1>
      ) : (
        <h1>Admin Login</h1>
      )}

      {isError ? <p className={styles.error_message}>{reason}</p> : ""}
      <label htmlFor="email"></label>
      <div data-testid={"emailError"} className={styles.error}>
        {emailError}
      </div>
      <CustomInput name={"email"} placeholder={"email"} setValue={setEmail} />
      <label htmlFor="password"></label>
      <div data-testid={"passwordError"} className={styles.error}>
        {passwordError}
      </div>
      <CustomInput
        password={true}
        name={"password"}
        placeholder={"password"}
        setValue={setPassword}
      />
      <CustomButton type={1} text={"Login"} onClick={() => login()} />

      {isAdmin ? (
        <></>
      ) : (
        <CustomButton type={2} text={"Sign Up"} onClick={signUp} />
      )}
    </>
  );
};

LoginBox.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default LoginBox;
