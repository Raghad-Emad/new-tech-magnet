import React, { useEffect, useState } from "react";
import { getStudentsSubmissionsByClass } from "../../../http_Requests/StudentRequests/SubmissionRequests";
import {
  getStudentsInClass,
  removeStudentFromClass,
} from "../../../http_Requests/teacherRequests";
import AssignmentSubmissions from "../../../Pages/Teacher/AssignmentSubmissions";
import SubmissionItem from "../../AssignmentSubmissions/SubmissionItem";
import CustomButton from "../../CustomButton";
import styles from "./ListStudents.module.css";
import StudentsSubmission from "./StudentsSubmission";

const ListStudents = ({ classID, flipIsShowStudents }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(false);
  const [studentsSubmissions, setStudentsSubmissions] = useState([]);
  //   const [searchResults, setSearchResults] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(async () => {
    let details = { classID: classID };
    let data = await getStudentsInClass(details);
    console.log(data);
    if (data.status === "success") setStudents(data.data);
  }, [isDeleted]);

  const removeStudent = async (studentID) => {
    let data = await removeStudentFromClass({ studentID, classID });
    if (data.status === "success") {
      console.log("successfully deleted user");
      setIsDeleted(!isDeleted);
    }
  };
  const viewSubmissions = async (student) => {
    setSelectedStudent(student);
    const result = await getStudentsSubmissionsByClass({
      studentID: student.StudentID,
      classID: classID,
    });
    console.log(result);
    if (result.status === "success") {
      setStudentsSubmissions(result.data);
    }
  };
  const studentTable = () => {
    return (
      <div className={styles.container}>
        <div className={styles.column_names}>
          <p>Email</p>
          <p>First name</p>
          <p>Last name</p>
        </div>
        <div className={styles.students}>
          {students.map((student, i) => (
            <div className={styles.student} key={student.StudentID}>
              <p>{student.Email}</p>
              <p>{student.FirstName}</p>
              <p>{student.LastName}</p>
              <CustomButton
                text={"Submissions"}
                fill={true}
                onClick={() => {
                  viewSubmissions(student);
                }}
              />
              <CustomButton
                text={"Remove"}
                fill={true}
                onClick={() => removeStudent(student.StudentID)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };
  const studentsSubmission = () => {
    return (
      <div className={styles.container}>
        <h3 style={{ marginTop: 0 }}>StudentsName's Submissions</h3>
        <div className={styles.sub_col_names}>
          <p>Assignment name</p>
          <p>Score</p>
          <p>Date Complete</p>
          <p>Rating</p>
        </div>
        <div className={styles.students}>
          {studentsSubmissions.map((student) => (
            <StudentsSubmission
              name={student.QuizName}
              score={student.score}
              total={student.total}
              completedDate={student.subDate}
              rating={student.rating}
            />
          ))}
        </div>
      </div>
    );
  };
  return (
    // <div className="right-box vFill user-search">
    <>
      <div className={styles.search_box}>
        <CustomButton
          text={"X"}
          fill={true}
          onClick={() =>
            !selectedStudent ? flipIsShowStudents() : setSelectedStudent(null)
          }
        />
      </div>
      {selectedStudent ? studentsSubmission() : studentTable()}
    </>
    // </div>
  );
};

export default ListStudents;
