import React, { useEffect, useState } from "react";

import AssignmentItem from "../Components/StudentProfile/AssignmentItem";
import Banner from "../Components/StudentProfile/Banner";

import {
  getStudentsAssignmentQuizzes,
  getUserDetails,
} from "../http_Requests/userRequests";

import styles from "./StudentProfile.module.css";
import { getFeedRequest } from "../http_Requests/StudentRequests/FeedRoutes";
import ResultsItem from "../Components/StudentProfile/ResultsItem";
import ProfileCover from '../assets/profilebg.jpg'

const StudentProfile = () => {
  const [assignments, setAssignments] = useState([]);
  const [feed, setFeed] = useState([]);

  const [usersName, setUsersName] = useState("");
  const [selectedTab, setSelectedTab] = useState(1);

  const [profilePicture, setProfilePicture] = useState();
  const [banner, setBanner] = useState(0);
  const [xp, setXp] = useState(0);
  const [requiredXp, setRequiredXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [coins, setCoins] = useState(0);

  const tabs = ["Assignments", "Feed"];
  useEffect(async () => {
    //get page details
    // const dataAssignment = null,
    const dataAssignment = await getStudentsAssignmentQuizzes();
    // const [dataStudentDetails, dataAssignment, dataFeed] = await Promise.all([
    //   getUserDetails(),
    //   getStudentsAssignmentQuizzes(),
    //   getFeedRequest(),
    // ]);

    const dataStudentDetails = await getUserDetails();
    const dataFeed = await getFeedRequest();
    //student details
    if (dataStudentDetails.hasOwnProperty("data")) {
      const {
        FirstName,
        LastName,
        Email,
        Coins,
        Xp,
        RequiredXp,
        Level,
        ProfilePicture,
        Banner,
      } = dataStudentDetails.data;
      setUsersName(`${FirstName} ${LastName}`);
      setXp(Xp);
      setRequiredXp(RequiredXp);
      setLevel(Level);
      setCoins(Coins);
      setBanner(Banner);
      setProfilePicture(ProfilePicture);
    }
    // console.log("asd");
    // assignments
    if (dataAssignment.hasOwnProperty("quizzes")) {
      setAssignments(dataAssignment.quizzes);
    }
    if (dataFeed.status == "success") {
      setFeed(dataFeed.data);
    }
  }, []);

  return (
    <div className="content-box" data-testid={"studentProfile"}>
      <div className={styles.container}>
        <Banner
          banner={banner}
          level={level}
          profilePicture={profilePicture}
          usersName={usersName}
          coins={coins}
          xp={xp}
          requiredXp={requiredXp}
        />
        
        <div className={styles.content}>
          <div className={styles.tabs}>
            {tabs.map((tab, i) => {
              // highlight selected tab
              let isSelected = false;
              let j = i + 1;
              if (j === selectedTab) {
                isSelected = true;
              }
              return (
                <h2
                  key={j}
                  tabIndex={0}
                  role="button"
                  aria-selected={isSelected}
                  onClick={() => setSelectedTab(j)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) setSelectedTab(j);
                  }}
                >
                  {tab}
                </h2>
              );
            })}
          </div>
          {selectedTab == 1 ? (
            <>
              <div className={styles.column_names}>
                <p>Name</p>
                <p>Class</p>
                <p>Teacher</p>
                <p>Module</p>
                <p>Due Date</p>
              </div>
              <div className={styles.list_items}>
                {assignments.map((a, i) => (
                  <AssignmentItem
                    key={i}
                    id={a.QuizID}
                    className={a.ClassName}
                    assignmentName={a.QuizName}
                    teacherName={`${a.FirstName} ${a.LastName}`}
                    ModuleName={a.ModuleName}
                    Caption={a.Caption}
                    dueDate={a.DueDate}
                  />
                ))}
              </div>
            </>
          ) : (
            <></>
          )}

          {selectedTab == 2 ? (
            <div className={styles.list_items}>
              {feed.map((item, i) => {
                if (item.Caption === "Assignment") {
                  return (
                    <AssignmentItem
                      key={i}
                      id={item.QuizID}
                      className={item.className}
                      assignmentName={item.quizName}
                      teacherName={`${item.firstname} ${item.lastname}`}
                      ModuleName={item.moduleName}
                      Caption={item.Caption}
                      dueDate={item.DueDate}
                    />
                  );
                } else if (item.Caption === "Submission") {
                  return (
                    <ResultsItem
                      key={i}
                      firstname={item.firstname}
                      lastname={item.lastname}
                      profilePicture={item.profilePicture}
                      className={item.className}
                      quizName={item.QuizName}
                      score={item.score}
                      total={item.Total}
                      subDate={item.subDate}
                    />
                  );
                }
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
