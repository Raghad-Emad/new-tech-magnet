import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../http_Requests/AdminRequests/AccountRequests";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import OverlayConfirm from "../OverlayConfirm";
import styles from "./AccountActions.module.css";
const CreateAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [isCreated, setIsCreated] = useState(false);

  const navigate = useNavigate();

  const create = async () => {
    if (password === confirmPassword) {
      const data = await createAdmin({ email, password, firstname, lastname });
      if (data.status === "success") {
        setIsCreated(true);
      }
    } else {
      alert("Passwords do not match");
    }
  };
  return (
    <div className="content-box">
      <h1>Create Admin</h1>
      <div className={styles.container}>
        <div className={styles.input_container}>
          <p>Firstname</p>
          <CustomInput
            placeholder={"Firstname"}
            value={firstname}
            setValue={setFirstname}
          />
          <p>Lastname</p>
          <CustomInput
            placeholder={"Lastname"}
            value={lastname}
            setValue={setLastname}
          />
          <p>Email</p>
          <CustomInput
            placeholder={"Email"}
            value={email}
            setValue={setEmail}
          />
          <p>Password</p>
          <CustomInput
            placeholder={"Password"}
            value={password}
            setValue={setPassword}
            password={true}
          />
          <p>Confirm Password</p>
          <CustomInput
            placeholder={"Confirm Password"}
            value={confirmPassword}
            setValue={setConfirmPassword}
            password={true}
          />
        </div>
        <CustomButton text={"Create Admin"} fill={true} onClick={create} />
      </div>
      {isCreated ? (
        <OverlayConfirm
          message={"Admin Created"}
          type={2}
          yes={() => navigate("/account", {})}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreateAdmin;
