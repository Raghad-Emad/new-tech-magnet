import React, { useState } from "react";
import { createClass } from "../../../http_Requests/teacherRequests";
import styles from "./AddClass.module.css";
import CustomButton from "../../CustomButton";
import CustomInput from "../../CustomInput";

const AddClass = ({ flipAddClass, classChanged }) => {
  const [className, setClassName] = useState();
  const [yearGroup, setYearGroup] = useState();
  const addToClass = async () => {
    // e.preventDefault();
    let details = { name: className, year: yearGroup };
    let data = await createClass(details);
    console.log(data);
    if (data.status === "success") {
      console.log("class created successfully");
      classChanged();
      flipAddClass();
    } else {
      console.log("failed");
    }
  };
  return (
    <div className={styles.container}>
      <h2>Add class</h2>
      <label htmlFor="name">Class Name</label>
      <CustomInput name={"name"} type={"text"} setValue={setClassName} />
      <label htmlFor="yearGroup">Year group</label>
      <CustomInput name={"yearGroup"} type={"text"} setValue={setYearGroup} />
      <CustomButton text={"Confirm"} onClick={addToClass} />
      <CustomButton text={"Back"} type={2} onClick={() => flipAddClass()} />
    </div>
  );
};

export default AddClass;
