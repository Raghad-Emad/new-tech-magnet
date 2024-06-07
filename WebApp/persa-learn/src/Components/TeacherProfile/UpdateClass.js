import React, { useState } from "react";
import { updateClass } from "../../http_Requests/teacherRequests";
import styles from "./UpdateClass.module.css";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";

const UpdateClass = ({
  selectedClass,
  flipIsUpdating,
  classChanged,
  classID,
}) => {
  const [className, setClassName] = useState(selectedClass.name);
  const [yearGroup, setYearGroup] = useState(selectedClass.yearGroup);
  const [classNameError, setClassNameError] = useState(null);
  const [yearGroupError, setYearGroupError] = useState(null);

  const updateTheClass = async () => {
    if (className == null || className == "") {
      setClassNameError("Please enter a class name");
    } else {
      setClassNameError(null);
    }
    if (yearGroup == null || yearGroup == "") {
      setYearGroupError("Please enter a year group");
    } else if (isNaN(yearGroup)) {
      setYearGroupError("Please enter a valid year group");
    } else {
      setYearGroupError(null);
    }

    if (
      className != null &&
      className != "" &&
      yearGroup != null &&
      yearGroup != "" &&
      !isNaN(yearGroup)
    ) {
      let details = { name: className, year: yearGroup, classID: classID };
      let data = await updateClass(details);

      if (data.status === "success") {
        console.log("class updated successfully");
        classChanged();
        flipIsUpdating();
      } else {
        alert("Unable to update class");
      }
    }
  };
  return (
    // <div className="right-box vFill">
    <div className={styles.container}>
      <h2 className={styles.heading}>Updating class</h2>
      <label className={styles.subheading} htmlFor="name">
        Class Name
      </label>
      <div className={styles.error}>{classNameError}</div>
      <CustomInput name={"name"} value={className} setValue={setClassName} />
      <label className={styles.subheading} htmlFor="yearGroup">
        Year group
      </label>
      <div className={styles.error}>{yearGroupError}</div>
      <CustomInput
        name={"yearGroup"}
        value={yearGroup}
        setValue={setYearGroup}
      />
      <CustomButton text={"Update Class"} onClick={updateTheClass} />
      <CustomButton text={"Back"} onClick={() => flipIsUpdating()} type={2} />
    </div>
  );
};

export default UpdateClass;
