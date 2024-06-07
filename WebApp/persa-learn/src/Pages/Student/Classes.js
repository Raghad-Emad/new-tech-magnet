import React, { useState, useEffect } from "react";
import RequestItem from "../../Components/Student/Classes/RequestItem";
import ClassItem from "../../Components/StudentProfile/ClassItem";
import { getClassRequests } from "../../http_Requests/StudentRequests/ClassRequestRequests";
import { getStudentsClassses } from "../../http_Requests/userRequests";
import styles from "./Classes.module.css";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [requests, setRequests] = useState([]);
  const tabs = ["Class Requests", "AllClasses"];
  const [selectedTab, setSelectedTab] = useState(1);

  const getAllRequests = async () => {
    const requestData = await getClassRequests();
    if (requestData.hasOwnProperty("data")) {
      setRequests(requestData.data);
    }
  };

  const getAllClasses = async () => {
    const data = await getStudentsClassses();
    if (data.hasOwnProperty("data")) {
      setClasses(data.data);
    }
  };

  useEffect(async () => {
    await getAllClasses();
    await getAllRequests();
  }, []);
  return (
    <div className="content-box">
      <h1>Classes</h1>
      <div className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map((tab, i) => {
            // highlight selected tab
            let isSelected = false;
            let j = i + 1;
            if (j === selectedTab) {
              isSelected = true;
            }
            return (
              <h3
                key={j}
                aria-selected={isSelected}
                onClick={() => setSelectedTab(j)}
              >
                {tab}
              </h3>
            );
          })}
        </div>
        {selectedTab == 1 ? (
          <div className={styles.list_items}>
            {requests.map((c) => (
              <RequestItem
                key={c.ClassDetailsID}
                id={c.ClassDetailsID}
                className={c.ClassName}
                firstname={c.FirstName}
                lastname={c.LastName}
                dateSent={c.DateSent}
                yearGroup={c.YearGroup}
                getAllRequests={getAllRequests}
                getAllClasses={getAllClasses}
              />
            ))}
          </div>
        ) : (
          <div className={styles.list_items}>
            {classes.map((c) => (
              <ClassItem
                key={c.ClassDetailsID}
                id={c.ClassDetailsID}
                name={c.Name}
                firstname={c.FirstName}
                lastname={c.LastName}
                yearGroup={c.YearGroup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
