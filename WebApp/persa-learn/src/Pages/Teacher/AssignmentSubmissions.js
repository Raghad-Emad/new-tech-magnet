import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SubmissionItem from "../../Components/AssignmentSubmissions/SubmissionItem";
import { getQuizSubmissions } from "../../http_Requests/AssignmentRequests";

import styles from "./AssignmentSubmissions.module.css";
const AssignmentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const { state } = useLocation();

  useEffect(async () => {
    const data = await getQuizSubmissions({
      cID: state.classID,
      qID: state.quizID,
    });
    console.log("This", data);
    setSubmissions(data.data);
  }, []);
  return (
    <div className="content-box">
      <h1>{state.className} Assignment Submissions</h1>
      <div className={styles.container}>
        <div className={styles.submissions_container}>
          <div className={styles.col_names}>
            <p>Email</p>
            <p className={styles.module}>Name</p>
            <p className={styles.num_quest}>Score</p>
            <p>Completed</p>
            <p>Rating</p>
          </div>
          {submissions.map((sub) => (
            <SubmissionItem
              email={sub.email}
              name={`${sub.firstname} ${sub.lastname}`}
              score={sub.score}
              completedDate={sub.subDate}
              rating={sub.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
