import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDetails } from "../../http_Requests/AdminRequests/AccountRequests";
import CustomButton from "../CustomButton";
import styles from "./AccountActions.module.css";
import OverlayChangePassword from "./OverlayChangePassword";

const AccountActions = () => {
  const [email, setEmail] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();

  const [isChangePassword, setIsChangePassword] = useState(false);
  const navigate = useNavigate();

  const getAccountDetails = async () => {
    const data = await getAdminDetails();
    if (data.status === "success") {
      setEmail(data.data[0].Email);
      setFirstname(data.data[0].Firstname);
      setLastname(data.data[0].Lastname);
    }
  };
  useEffect(async () => {
    await getAccountDetails();
  });
  return (
    <div className="content-box">
      <h1>Admin Actions</h1>
      <div className={styles.container}>
        <h2>Details</h2>
        <p>Email: {email}</p>
        <p>Firstname: {firstname}</p>
        <p>Lastname: {lastname}</p>
        <h2>Create</h2>
        <CustomButton
          text={"Create Another Admin"}
          onClick={() => navigate("/create", {})}
        />
        <h2>Edit</h2>
        <CustomButton
          text={"Edit Account"}
          onClick={() =>
            navigate("/account/edit", {
              state: {
                firstName: firstname,
                lastName: lastname,
                email: email,
              },
            })
          }
        />
        <CustomButton
          text={"Change Password"}
          onClick={() => setIsChangePassword(true)}
        />
        {isChangePassword ? (
          <OverlayChangePassword
            close={() => {
              setIsChangePassword(false);
            }}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AccountActions;
