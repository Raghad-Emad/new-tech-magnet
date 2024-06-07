import React, { useEffect, useState } from "react";
import CustomButton from "../../Components/CustomButton";
import ClassList from "../../Components/TeacherProfile/ClassList/ClassList";
import styles from "./Classes.module.css";
import { useNavigate } from "react-router-dom";

import {
  AiOutlineExpandAlt,
  AiOutlineShrink,
  AiOutlineClose,
} from "react-icons/ai";
import AddClass from "../../Components/TeacherProfile/DetailsBox/AddClass";
import ClassDetails from "../../Components/TeacherProfile/DetailsBox/ClassDetails";
import {
  getTeachersClasses,
  getTeachersDetails,
} from "../../http_Requests/teacherRequests";

export const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState();
  const [classSuccess, setClassSuccess] = useState(false);
  const [showDetailBox, setShowDetailBox] = useState(false);
  // current right view
  const [addingClass, setAddingClass] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isShowStudents, setIsShowStudents] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const navigate = useNavigate();

  // const [usersName, setUsersName] = useState();
  //   const getDetails = async () => {
  //     const data = await getTeachersDetails();
  //     // console.log(data);
  //     if (data.status === "success") {
  //       // console.log(data.details);

  //       setFirstName(data.details.FirstName);
  //     }
  //   };

  useEffect(() => {
    classChanged();
  }, [selectedClass]);

  //   useEffect(async () => {
  //     await getDetails();
  //   }, []);

  const classChanged = () => {
    setClassSuccess(!classSuccess);
    setIsUpdating(false);
    setIsSearching(false);
    setIsShowStudents(false);
  };

  useEffect(async () => {
    let data = await getTeachersClasses();
    console.log(data);
    if (data.hasOwnProperty("data")) {
      setClasses(data.data);
    }
  }, [classSuccess]);

  const flipAddClass = () => {
    setAddingClass(!addingClass);
  };

  return (
    <div className="content-box">
      <h1>Classes</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Classes</h2>
        <ClassList
          classes={classes}
          flipAddClass={flipAddClass}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
        {addingClass || selectedClass ? (
          <div
            className={styles.details_box}
            style={isExpanded ? { width: "100%", height: "100%", top: 0 } : {}}
          >
            <div className={styles.control_bar}>
              <CustomButton
                text={<AiOutlineClose />}
                type={4}
                onClick={() => {
                  setAddingClass(false);
                  setSelectedClass(false);
                }}
              />
              <CustomButton
                text={isExpanded ? <AiOutlineShrink /> : <AiOutlineExpandAlt />}
                type={4}
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              />
            </div>
            <div className={styles.content}>
              {addingClass ? (
                <AddClass
                  flipAddClass={flipAddClass}
                  classChanged={classChanged}
                />
              ) : selectedClass ? (
                <ClassDetails
                  setSelectedClass={setSelectedClass}
                  selectedClass={selectedClass}
                  classID={selectedClass.id}
                  name={selectedClass.name}
                  yearGroup={selectedClass.yearGroup}
                  classChanged={classChanged}
                  setIsSearching={setIsSearching}
                  isSearching={isSearching}
                  setIsUpdating={setIsUpdating}
                  isUpdating={isUpdating}
                  setIsShowStudents={setIsShowStudents}
                  isShowStudents={isShowStudents}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* <div className={styles.details_box}>
          {addingClass ? (
            <AddClass flipAddClass={flipAddClass} classChanged={classChanged} />
          ) : selectedClass ? (
            <ClassDetails
              setSelectedClass={setSelectedClass}
              selectedClass={selectedClass}
              classID={selectedClass.id}
              name={selectedClass.name}
              yearGroup={selectedClass.yearGroup}
              classChanged={classChanged}
              setIsSearching={setIsSearching}
              isSearching={isSearching}
              setIsUpdating={setIsUpdating}
              isUpdating={isUpdating}
              setIsShowStudents={setIsShowStudents}
              isShowStudents={isShowStudents}
            />
          ) : (
            <></>
            // <div className="right-box vFill">
            //   <h2>Select a class</h2>
            // </div>
          )}
        </div> */}
        {/* <div className="left-box task-box">
          {classes.map((c, i) => {
            let classSelected = false;
            if (selectedClass) {
              if (selectedClass.id === c.classdetailsID) {
                classSelected = true;
              }
            }
            return (
              <Class
                key={c.classdetailsID}
                id={c.classdetailsID}
                name={c.Name}
                yearGroup={c.YearGroup}
                setSelectedClass={setSelectedClass}
                classSelected={classSelected}
              />
            );
          })}
          <div className="bottom-bar">
            <button
              className="btn"
              onClick={() => {
                flipAddClass();
              }}
            >
              Add class
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
