import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import {
  editTeachers,
  getTeachersDetails,
} from "../../http_Requests/teacherRequests";
import styles from "./TeacherDetails.module.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TeacherEdit = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [emailError, setEmailError] = useState();
  const [firstNameError, setFirstNameError] = useState();
  const [lastNameError, setLastNameError] = useState();
  const [phonenumberError, setPhonenumberError] = useState();

  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const getDetails = async () => {
    const data = await getTeachersDetails();
    console.log(data);
    if (data.status === "success") {
      setFirstName(data.details.FirstName);
      setLastName(data.details.LastName);
      setEmail(data.details.email);
      setPhoneNumber(data.details.PhoneNumber);
    } else alert("An error occured, unable to edit details");
  };

  const saveChanges = async () => {
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
    if (phoneNumber == null || phoneNumber == "") {
      setPhonenumberError("Please enter a phonenumber");
    } else {
      setPhonenumberError(null);
    }

    if (
      email != null &&
      firstName != null &&
      lastName != null &&
      email != "" &&
      firstName != "" &&
      lastName != "" &&
      phoneNumber != null &&
      phoneNumber != "" &&
      EMAIL_REGEX.test(email)
    ) {
      const data = await editTeachers({
        email,
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber,
      });
      console.log(data);
      if (data.status === "success") {
        sessionStorage.clear();
        setIsSuccess(true);
      }
    }
  };
  useEffect(async () => {
    await getDetails();
  }, []);
  return (
    <div className="content-box">
      <h1>Teacher Edit</h1>
      <div className={styles.container}>
        {isSuccess ? (
          <>
            <h2 className={styles.success_message}>Successfully changed</h2>
            <CustomButton
              text={"Login"}
              onClick={() => {
                navigate("/details_teacher", {});
                window.location.reload();
              }}
            />
          </>
        ) : (
          <>
            <h2>Email</h2>
            <div className={styles.error}>{emailError}</div>
            <CustomInput
              placeholder={"Email"}
              setValue={setEmail}
              value={email}
            />
            <h2>First name</h2>
            <div className={styles.error}>{firstNameError}</div>
            <CustomInput
              placeholder={"First name"}
              setValue={setFirstName}
              value={firstName}
            />
            <h2>Last name</h2>
            <div className={styles.error}>{lastNameError}</div>
            <CustomInput
              placeholder={"Last name"}
              setValue={setLastName}
              value={lastName}
            />
            <h2>Phone number</h2>
            <div className={styles.error}>{phonenumberError}</div>
            <CustomInput
              placeholder={"Phone number"}
              setValue={setPhoneNumber}
              value={phoneNumber}
            />
            <CustomButton text={"Save Changes"} onClick={saveChanges} />
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherEdit;
