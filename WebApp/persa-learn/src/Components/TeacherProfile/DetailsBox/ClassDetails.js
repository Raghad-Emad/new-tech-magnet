import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteClass } from "../../../http_Requests/teacherRequests";
import CustomButton from "../../CustomButton";
import OverlayConfirm from "../../OverlayConfirm";
import ListStudents from "./ListStudents";
import SearchStudents from "./SearchStudents";
import UpdateClass from "../UpdateClass";
import styles from "./ClassDetails.module.css";
import Progressbar from "./Progressbar";
import { getAssignmentProgress } from "../../../http_Requests/AssignmentRequests";

const ClassDetails = ({
  name = "Name",
  setSelectedClass,
  selectedClass,
  classID,
  yearGroup,
  classChanged,
  setIsSearching,
  isSearching,
  setIsUpdating,
  isUpdating,
  setIsShowStudents,
  isShowStudents,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [overalComplete, setOveralComplete] = useState(0);
  const [overalIncomplete, setOveralIncomplete] = useState(0);

  const navigate = useNavigate();

  const flipIsUpdating = () => {
    setIsUpdating(!isUpdating);
  };

  const flipIsShowStudents = () => {
    setIsShowStudents(!isShowStudents);
  };

  const deleteThisClass = async () => {
    // check if user wants to delete
    let data = await deleteClass({ classID });
    console.log(data);
    classChanged();
    setIsDeleting(false);
    setSelectedClass();
  };
  useEffect(async () => {
    const data = await getAssignmentProgress({ cID: classID });
    console.log(data);
    if (data.status === "success") {
      setOveralComplete(data.data[1].Number);
      setOveralIncomplete(data.data[0].Number);
    } else {
      setOveralComplete(0);
      setOveralIncomplete(0);
    }
  }, [classID]);
  if (isSearching)
    return (
      <SearchStudents
        setSelectedClass={selectedClass}
        classID={classID}
        setIsSearching={setIsSearching}
        isSearching={isSearching}
      />
    );
  if (isUpdating)
    return (
      <UpdateClass
        selectedClass={selectedClass}
        classID={classID}
        classChanged={classChanged}
        flipIsUpdating={flipIsUpdating}
      />
    );
  if (isShowStudents)
    return (
      <ListStudents classID={classID} flipIsShowStudents={flipIsShowStudents} />
    );

  return (
    // <div className="right-box vFill">
    <>
      <div className={styles.class_details}>
        <h2>Class {name}'s Details</h2>
        <p>Year Group: {yearGroup}</p>
        <h3>Class Progress:</h3>
        <Progressbar complete={overalComplete} incomplete={overalIncomplete} />
        <CustomButton
          text={"Add Student"}
          onClick={() => setIsSearching(!isSearching)}
        />
        <CustomButton
          text={"View Students"}
          onClick={() => flipIsShowStudents()}
        />
        <CustomButton text={"Update Class"} onClick={() => flipIsUpdating()} />
        <CustomButton
          text={"Delete Class"}
          onClick={() => setIsDeleting(true)}
        />
        <CustomButton
          text={"Assignments"}
          onClick={() =>
            navigate("/Assign", {
              state: selectedClass,
            })
          }
        />
      </div>
      {isDeleting ? (
        <OverlayConfirm
          message={"Are you sure you want to delete this class?"}
          yes={() => deleteThisClass()}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
      {/* // </div> */}
    </>
  );
};

export default ClassDetails;
