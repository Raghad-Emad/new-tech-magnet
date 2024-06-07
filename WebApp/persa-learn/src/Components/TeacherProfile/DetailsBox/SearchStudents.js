import React, { useState, useEffect } from "react";
import {
  addStudentToClass,
  allStudents,
  searchStudents,
} from "../../../http_Requests/teacherRequests";
import {
  createClassRequest,
  getClassRequestsByClass,
  removeClassRequest,
} from "../../../http_Requests/TeacherRequests/ClassRequestRequests";
import CustomButton from "../../CustomButton";
import CustomInput from "../../CustomInput";
import styles from "./SearchStudents.module.css";

const SearchStudents = ({ classID, setIsSearching, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getAllStudents = async () => {
    const data = await getClassRequestsByClass({
      classID: classID,
      searchTerm,
    });
    if (data.status === "success") {
      setSearchResults(data.data);
    }
  };

  useEffect(async () => {
    // get all students from database
    await getAllStudents();
  }, []);

  const addStudent = async (studentID) => {
    let details = { studentID, classID };
    // add student to the class
    let data = await createClassRequest(details);
    console.log(data);
    if (data.status === "success") getAllStudents();
  };
  const removeStudent = async (studentID) => {
    let details = { studentID, classID };
    // add student to the class
    let data = await removeClassRequest(details);
    if (data.status === "success") getAllStudents();
  };

  const searchForStudents = async () => {
    console.log(searchTerm);
    //get students
    await getAllStudents();
  };
  console.log(classID);

  return (
    <>
      <div className={styles.search_box}>
        <CustomButton
          text={"X"}
          onClick={() => setIsSearching(!isSearching)}
          fill={true}
        />

        <p>Search</p>
        {/* <input type="text" onChange={(e) => setSearchTerm(e.target.value)} /> */}
        <CustomInput
          name={"search"}
          // onChange={(e) => setSearchTerm(e.target.value)}
          setValue={setSearchTerm}
          fill={true}
        />
        {/* <button className="btn" onClick={() => searchForStudents()}>
          Search
        </button> */}
        <CustomButton
          text={"Go"}
          onClick={() => searchForStudents()}
          fill={true}
        />
      </div>
      <div className={styles.column_names}>
        <p>Email</p>
        <p>First name</p>
        <p>Last name</p>
      </div>
      <div className={styles.search_results}>
        {searchResults.map((student, i) => (
          <div className={styles.result} key={i}>
            {/* <p>{student.StudentID}</p> */}
            <p>{student.Email}</p>
            <p>{student.FirstName}</p>
            <p>{student.LastName}</p>
            {/* <button
              className="btn"
              onClick={() => addStudent(student.StudentID)}
            >
              Add
            </button> */}
            {!student.isRequest ? (
              <CustomButton
                text={"Add"}
                onClick={() => addStudent(student.StudentID)}
                fill={true}
              />
            ) : (
              <CustomButton
                text={"Remove"}
                onClick={() => removeStudent(student.StudentID)}
                fill={true}
              />
            )}
            {/* <CustomButton
              text={"Add"}
              onClick={() => addStudent(student.StudentID)}
              fill={true}
            />
            <CustomButton
              text={"Remove"}
              onClick={() => removeStudent(student.StudentID)}
              fill={true}
            /> */}
          </div>
        ))}
        {/* <div className="result">studentName</div> */}
      </div>
    </>
    // </div>
  );
};

export default SearchStudents;
