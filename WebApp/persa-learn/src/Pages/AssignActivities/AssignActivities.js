import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TeachersQuizzes from "../../Components/QuizDesigner/TeachersQuizzes";
import {
  deleteTheQuiz,
  viewTeachersQuizzes,
  viewTeachersQuizzesByClass,
} from "../../http_Requests/teacherRequests";

import {
  assignQuizToClass,
  unassignQuizFromClass,
} from "../../http_Requests/AssignmentRequests";

import styles from "./AssignActivities.module.css";

import "react-datepicker/dist/react-datepicker.css";
import AssignmentOverlay from "../../Components/TeacherProfile/AssignActivities/AssignmentOverlay";
import DeleteOverlay from "../../Components/TeacherProfile/AssignActivities/DeleteOverlay";
import OverlayConfirm from "../../Components/OverlayConfirm";

const AssignActivities = () => {
  const { state } = useLocation();

  const [selectedClass, setSelectedClass] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [quizID, setQuizID] = useState(null);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  const [dueDateError, setDueDateError] = useState(null);
  const [xpError, setXpError] = useState(null);
  const [coinsError, setCoinsError] = useState(null);

  const [settingDate, setSettingDate] = useState(false);
  const [isDeleting, setIsDelete] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);

  console.log(state);
  useEffect(async () => {
    await setSelectedClass({
      classID: state.id,
      className: state.name,
      yearGroup: state.yearGroup,
    });
    await getAssignments();
  }, []);

  const getAssignments = async () => {
    const data = await viewTeachersQuizzesByClass(state.id);
    console.log("quizzes: ", data);
    setQuizzes(data.quizzes);
  };

  const assignToClass = async (qID) => {
    setQuizID(qID);
    setSettingDate(true);
  };

  const unassignFromClass = async (qID) => {
    setIsUnassigning(true);
    setQuizID(qID);
  };

  const submitAssignToClass = async () => {
    if (xp == null || xp == "") {
      setXpError("Please enter xp");
    } else if (isNaN(xp)) {
      setXpError("Please enter a valid xp");
    } else {
      setXpError(null);
    }
    if (dueDate == null || dueDate == "") {
      setDueDateError("Please enter a due date");
    } else {
      setDueDateError(null);
    }
    if (coins == null || coins == "") {
      setCoinsError("Please enter coin");
    } else if (isNaN(coins)) {
      setCoinsError("Please enter valid coins");
    } else {
      setCoinsError(null);
    }
    if (
      xp != null &&
      xp != "" &&
      !isNaN(xp) &&
      dueDate != null &&
      dueDate != "" &&
      coins != null &&
      coins != "" &&
      !isNaN(coins)
    ) {
      const data = await assignQuizToClass({
        coins,
        xp,
        classID: selectedClass.classID,
        quizID,
        dueDate: dueDate.toISOString().slice(0, 19).replace("T", " "),
      });
      console.log(data);
      if (data.status === "failure")
        alert("an error occured when attempting to assign");
      else {
        await getAssignments();
      }
      setSettingDate(false);
    }
  };
  const submitUnassignFromClass = async () => {
    const data = await unassignQuizFromClass({
      classID: selectedClass.classID,
      quizID,
    });
    console.log(data);
    if (data.status === "failure")
      alert("an error occured when attempting to unassign");
    else {
      await getAssignments();
    }
    setIsUnassigning(false);
  };

  const deleteQuiz = async (quizID) => {
    setQuizID(quizID);
    // show overlay message
    setIsDelete(true);
  };
  const deleteNow = async () => {
    console.log(`Deleted ${quizID}`);
    // delete quiz from database
    const res = await deleteTheQuiz({ quizID });
    console.log(res);
    // display message if unsuccessful
    if (res.status !== "success") {
      alert("error occured when deleting");
    } else {
      //get all quizzes
      await getAssignments();
    }
    // hide overlay message
    setIsDelete(false);
  };
  return (
    <div className="content-box">
      {/* <div className="container wide-container center-container"> */}
      <h1>Assign quizzes to class {selectedClass.className}</h1>
      {/* <div className="container wide-container center-container"> */}
      {/* <div className="content"> */}
      <div className={styles.container}>
        <TeachersQuizzes
          quizzes={quizzes}
          assignToClass={assignToClass}
          unassignFromClass={unassignFromClass}
          deleteQuiz={deleteQuiz}
          selectedClass={selectedClass}
          classID={selectedClass.classID}
          className={selectedClass.className}
        />
      </div>
      {/* </div> */}
      {/* </div> */}
      {settingDate ? (
        <AssignmentOverlay
          dueDate={dueDate}
          setDueDate={setDueDate}
          setXp={setXp}
          setCoins={setCoins}
          submitAssignToClass={submitAssignToClass}
          setSettingDate={setSettingDate}
          dueDateError={dueDateError}
          xpError={xpError}
          coinsError={coinsError}
        />
      ) : (
        <></>
      )}
      {isDeleting ? (
        <DeleteOverlay setIsDelete={setIsDelete} deleteNow={deleteNow} />
      ) : (
        <></>
      )}
      {isUnassigning ? (
        <OverlayConfirm
          message={"Are you sure you want to cancel this assignment?"}
          yes={submitUnassignFromClass}
          no={setIsUnassigning}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AssignActivities;
