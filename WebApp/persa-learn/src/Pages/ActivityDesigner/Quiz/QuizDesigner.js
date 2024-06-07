import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./QuizDesigner.module.css";

import CreateQuestionBox from "../../../Components/QuizDesigner/CreateQuestionBox";
import Overlay from "../../../Components/QuizDesigner/OverlayError";
import OverlayAddModule from "../../../Components/QuizDesigner/OverlayAddModule";
import {
  createModule,
  createTheQuiz,
  viewTeachersModules,
} from "../../../http_Requests/teacherRequests";
import OverlayComplete from "../../../Components/QuizDesigner/OverlayComplete";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";

const QuizDesigner = () => {
  const [title, setTitle] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [newModule, setNewModule] = useState();
  // const [selectedDate, setSelectedDate] = useState(null);

  const [selectedClass, setSelectedClass] = useState("");

  const [moduleList, setModuleList] = useState([]);

  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAddModule, setIsAddModule] = useState(false);
  const [moduleCreated, setModuleCreated] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  const getModules = async () => {
    let data = await viewTeachersModules();
    setModuleList(data.modules);
  };

  useEffect(async () => {
    //get data from previous page
    await setSelectedClass({
      id: state.classID,
      name: state.className,
      yearGroup: state.yearGroup,
    });
    //get all modules
    await getModules();
  }, []);

  // const addModule = async () => {
  //   // console.log(newModule);
  //   //add module to database
  //   if (newModule != null) {
  //     let data = await createModule({ moduleName: newModule });
  //     //get all modules
  //     let modData = await viewTeachersModules();
  //     setModuleList(modData.modules);
  //     setModuleCreated(true);
  //   } else {
  //     alert("please enter a module");
  //   }
  // };

  const addQuestion = () => {
    // e.preventDefault();
    //create empty question
    const question = {
      id: questions.length,
      name: "",
      details: "",
      correct: 0,
      options: [],
    };
    //add question to question array
    setQuestions([...questions, question]);
  };
  const updateQuestion = (qID, updatedQuestion) => {
    // copy old data
    let newData = [...questions];
    // update value based on question ID
    newData[qID] = updatedQuestion;
  };

  const createQuiz = async () => {
    console.log({
      title,
      questions,
      selectedModule,
      selectedClass,
    });

    let noTitle = false;
    if (title == null || title == "") {
      noTitle = true;
    }
    let noQuestions = false;
    if (questions.length <= 0) {
      noQuestions = true;
    }
    let noQuestionName = false;
    let noQuestionAns = false;
    let noOps = false;
    questions.map((x) => {
      console.log(x.options.length);
      if (x.Question == "" || x.Question == null) {
        noQuestionName = true;
        console.log("this", x);
      }
      if (x.Answer === "" || x.Answer === null || x.Answer === undefined) {
        noQuestionAns = true;
      }
      if (x.options.length <= 0) {
        noOps = true;
      } else {
        x.options.map((z) => {
          if (z == "") {
            noOps = true;
          }
        });
      }
    });
    if (
      !noTitle &&
      !noQuestions &&
      !noQuestionName &&
      !noQuestionAns &&
      !noOps
    ) {
      // console.log("send");
      // add quiz to database
      const data = await createTheQuiz({
        title,
        questions,
        selectedModule,
        selectedClass,
      });
      // display status
      if (data.status === "success") {
        setIsComplete(true);
      } else {
        setIsError(true);
      }
    } else {
      alert(
        `Please enter a ${noTitle ? "title" : ""} ${
          noQuestions ? ",a question" : ""
        } ${noQuestionName ? ",a question name" : ""} ${
          noQuestionAns ? ",an answer on every question" : ""
        }
            ${noOps ? ",options on all questions" : ""}`
      );
    }
  };

  return (
    <div className="content-box">
      <h1>Quiz designer</h1>
      <div className={styles.container}>
        <div className={styles.create_quiz_title}>
          <CustomInput
            placeholder={"Quiz Title"}
            setValue={setTitle}
            fill={true}
          />
          <select
            id="module"
            name="moduleList"
            className={styles.selector}
            onChange={(e) => {
              setSelectedModule(e.target.value);
            }}
          >
            {moduleList.map((m, i) => (
              <option value={m.ModuleID} key={m.ModuleID}>
                {m.ModuleName}
              </option>
            ))}
            <option value={null}>No Module</option>
          </select>
          <CustomButton
            text={"New Module"}
            onClick={() => setIsAddModule(true)}
            fill={true}
          />
        </div>
        {questions.map((quest, index) => {
          return (
            <CreateQuestionBox
              key={quest.id}
              qID={quest.id}
              thisQuestion={questions[quest.id]}
              updateQuestion={updateQuestion}
            />
          );
        })}
        <CustomButton text={"+"} type={2} onClick={addQuestion} />
        <CustomButton text={"Finished"} onClick={createQuiz} />
      </div>
      {isComplete ? (
        <OverlayComplete title={title} selectedClass={selectedClass} />
      ) : (
        <></>
      )}
      {/* <OverlayComplete title={title} selectedClass={selectedClass} /> */}
      {isError ? (
        <Overlay
          setIsError={setIsError}
          close={() => {
            setIsError(false);
            console.log(isError);
          }}
        />
      ) : (
        <></>
      )}

      {isAddModule ? (
        <OverlayAddModule
          isAddModule={isAddModule}
          moduleCreated={moduleCreated}
          setIsAddModule={setIsAddModule}
          setModuleCreated={setModuleCreated}
          getModules={getModules}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

{
  /* <div className="overlay" aria-disabled={!isAddModule}>
  <div className="message-box">
    {moduleCreated ? (
      <h1>Module created successfully</h1>
    ) : (
      <>
        {" "}
        <h1>Add a new module</h1>
        <input
          type="text"
          placeholder="module name"
          onChange={(e) => setNewModule(e.target.value)}
        />
        <button className="btn" onClick={() => addModule()}>
          Ok
        </button>
      </>
    )}
    <button
      className="btn"
      onClick={() => {
        setIsAddModule(false);
        setModuleCreated(false);
      }}
    >
      Back
    </button>
  </div>
</div> */
}
export default QuizDesigner;
