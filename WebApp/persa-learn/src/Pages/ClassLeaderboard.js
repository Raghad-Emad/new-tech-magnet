import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import LeaderboardStudent from "../Components/LeaderBoard/LeaderboardStudent";

import tempUserIcon from "../assets/UserIcons/001-man-1.png";
import { getStudentsInClass } from "../http_Requests/userRequests";
import TopStudent from "../Components/LeaderBoard/TopStudent";

import styles from "./ClassLeaderboard.module.css";
const ClassLeaderboard = () => {
  const { state } = useLocation();
  const [students, setStudents] = useState([]);
  const [topThree, setTopThree] = useState([]);
  // console.log(state.classID);

  useEffect(async () => {
    const data = await getStudentsInClass(state);
    console.log(data);
    if (data.status === "success") setStudents(data.data);
  }, []);

  useEffect(async () => {
    getTopThree();
  }, [students]);

  const getTopThree = () => {
    if (students.length > 1) {
      // get first 3 values from array
      const tempArray = students.slice(0, 3);
      // switch order to be displayed later
      const tempVal = tempArray[0];
      tempArray[0] = tempArray[1];
      tempArray[1] = tempVal;
      setTopThree(tempArray);
    } else if (students.length === 1) {
      const tempArray = [students[0]];
      setTopThree(tempArray);
    }
  };
  return (
    <div className="content-box">
      <h1>Class leaderboard</h1>
      {/* <div className="container wide-container center-container"> */}
      {/* <div className="leaderboard-box"> */}
      <div className={styles.container}>
        {/* <div className="top-students"> */}
        <div className={styles.top_students_container}>
          {topThree.map((student, i) => {
            let pos = i + 1;
            //adjust position for order of array (to display fist place in center)
            if (pos == 1) pos = 2;
            else if (pos == 2) pos = 1;
            if (topThree.length == 1) {
              return (
                <TopStudent
                  key={i}
                  // icon={tempUserIcon}
                  icon={student.ProfilePicture}
                  name={`${student.FirstName} ${student.LastName}`}
                  position={1}
                  level={student.Level}
                  xp={student.Xp}
                />
              );
            } else if (i < 3) {
              return (
                <TopStudent
                  key={i}
                  // icon={tempUserIcon}
                  icon={student.ProfilePicture}
                  name={`${student.FirstName} ${student.LastName}`}
                  position={pos}
                  level={student.Level}
                  xp={student.Xp}
                />
              );
            }
          })}
        </div>
        <div className={styles.students_container}>
          {students.map((student, i) => {
            if (i > 3) {
              return (
                <LeaderboardStudent
                  key={i}
                  // icon={tempUserIcon}
                  icon={student.ProfilePicture}
                  name={`${student.FirstName} ${student.LastName}`}
                  position={i}
                  level={student.Level}
                  xp={student.Xp}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ClassLeaderboard;
