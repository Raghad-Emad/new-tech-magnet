import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../Components/CustomButton";
import CustomInput from "../Components/CustomInput";
import styles from "./EditUserSettings.module.css";

import { updateUserDetails } from "../http_Requests/studentRequests";

const EditUserSettings = () => {
  //get variables passed from user settings
  const { state } = useLocation();
  const [email, setEmail] = useState(state.email);
  const [firstName, setFirstName] = useState(state.firstName);
  const [lastName, setLastName] = useState(state.lastName);
  const [emailError, setEmailError] = useState();
  const [firstNameError, setFirstNameError] = useState();
  const [lastNameError, setLastNameError] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigate = useNavigate();

  const updateUser = async (e) => {
    // e.preventDefault();

    if (email == null || email == "") {
      setEmailError("Please enter an email");
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError(null);
    }
    if (firstName == null || firstName == "") {
      setFirstNameError("Please enter a firstname");
    } else {
      setFirstNameError(null);
    }
    if (lastName == null || lastName == "") {
      setLastNameError("Please enter a lastname");
    } else {
      setLastNameError(null);
    }

    if (
      email != null &&
      firstName != null &&
      lastName != null &&
      email != "" &&
      firstName != "" &&
      lastName != "" &&
      EMAIL_REGEX.test(email)
    ) {
      const credentials = {
        email: email,
        firstname: firstName,
        lastname: lastName,
      };
      // send update request
      let data = await updateUserDetails(credentials);
      if (data.status === "success") {
        setIsSuccess(true);
        sessionStorage.clear();
        // window.location.reload();
      } else {
        setIsSuccess(false);
      }
      console.log("the data: ", data);
    }
  };
  return (
    <div className="content-box">
      {/* <div className="container wide-container center-container"> */}
      <h1>User settings</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Edit User Details</h2>

        {isSuccess ? (
          <>
            <h2 className={styles.success_message}>Successfully changed</h2>
            <CustomButton
              text={"Login"}
              onClick={() => {
                navigate("/", {});
                window.location.reload();
              }}
            />
          </>
        ) : (
          <>
            <label htmlFor="email" className={styles.title}>
              Email
            </label>
            <div className={styles.error}>{emailError}</div>
            <CustomInput value={email} name={"email"} setValue={setEmail} />
            <label htmlFor="firstname" className={styles.title}>
              First name
            </label>
            <div className={styles.error}>{firstNameError}</div>
            <CustomInput
              value={firstName}
              name={"firstname"}
              setValue={setFirstName}
            />
            <label htmlFor="lastname" className={styles.title}>
              Last name
            </label>
            <div className={styles.error}>{lastNameError}</div>
            <CustomInput
              value={lastName}
              name={"lastname"}
              setValue={setLastName}
            />
            <CustomButton text={"Update user"} onClick={updateUser} />
          </>
        )}
        {/* <div id="update-user-form"> */}

        {/* </div> */}
      </div>
    </div>
    // </div>
  );
};

export default EditUserSettings;
