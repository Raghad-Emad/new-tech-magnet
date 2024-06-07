import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import OverlayConfirm from "../../Components/OverlayConfirm";
import {
  deleteTeacher,
  getTeachersDetails,
} from "../../http_Requests/teacherRequests";
import OverlayPassword from "./OverlayPassword";
import styles from "./TeacherDetails.module.css";

const TeacherDetails = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  const [isDeleting, setIsDeleting] = useState();
  const [isChangePass, setIsChangePass] = useState();

  const navigate = useNavigate();

  const deleteUser = async () => {
    const data = await deleteTeacher();
    console.log(data);
    if (data.status === "success") {
      navigate("/", {});
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const getDetails = async () => {
    const data = await getTeachersDetails();
    if (data.status === "success") {
      setFirstName(data.details.FirstName);
      setLastName(data.details.LastName);
      setEmail(data.details.email);
      setPhoneNumber(data.details.PhoneNumber);
    }
  };
  useEffect(async () => {
    await getDetails();
  }, []);
  return (
    <div className="content-box">
      <h1>Profile</h1>
      <div className={styles.container}>
        <h2>My Details</h2>
        <h3>Email</h3>
        <p>{email}</p>
        <h3>First name</h3>
        <p>{firstName}</p>
        <h3>Last name</h3>
        <p>{lastName}</p>
        <h3>Phone number</h3>
        <p>{phoneNumber}</p>

        <CustomButton
          text={"Edit details"}
          onClick={() => navigate("/edit_teacher", {})}
        />
        <CustomButton
          text={"Change Password"}
          onClick={() => setIsChangePass(true)}
        />
        <CustomButton
          text={"Delete Account"}
          type={2}
          onClick={() => setIsDeleting(true)}
        />
      </div>
      {isDeleting ? (
        <OverlayConfirm
          message={`Are you sure you want to delete your account (${email})?`}
          yes={() => {
            deleteUser();
          }}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
      {isChangePass ? (
        <OverlayPassword close={() => setIsChangePass(false)} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TeacherDetails;
