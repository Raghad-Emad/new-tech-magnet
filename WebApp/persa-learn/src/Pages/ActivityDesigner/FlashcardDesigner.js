import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import { createFlashCard } from "../../http_Requests/StudentRequests/FlashCardRequests";
import styles from "./FlashcardDesigner.module.css";
const FlashcardDesigner = () => {
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [questionError, setQuestionError] = useState();
  const [answerError, setAnswerError] = useState();

  const { state } = useLocation();
  const navigate = useNavigate();

  const createCard = async () => {
    if (question == null || question == "") {
      setQuestionError("Please enter a question");
    } else {
      setQuestionError(null);
    }
    if (answer == null || answer == "") {
      setAnswerError("Please enter an answer");
    } else {
      setAnswerError(null);
    }
    if (question != null && answer != null && question != "" && answer != "") {
      console.log("ok");
      const data = await createFlashCard({
        DeckID: state.DeckID,
        Question: question,
        Answer: answer,
      });
      if (data.status === "success") {
        navigate("/flash-card/edit", {
          state,
        });
      }
      console.log(data);
    }
  };
  return (
    <div className="content-box">
      <h1>Flash Card!</h1>
      <div className={styles.container}>
        <div className={styles.title_container}>
          <h2>Deck Name: {state.Name}</h2>
        </div>
        <div className={styles.card_design_container}>
          <div className={styles.input_container}>
            <h2>Front</h2>
            <div className={styles.error}>{questionError}</div>
            <CustomInput
              placeholder={"add word"}
              setValue={setQuestion}
              fill={true}
            />
          </div>
          <div className={styles.input_container}>
            <h2>Back</h2>
            <div className={styles.error}>{answerError}</div>
            <CustomInput
              placeholder={"add word"}
              setValue={setAnswer}
              fill={true}
            />
          </div>
        </div>
        {/* <Flashcard
            question={currentCard.question}
            answer={currentCard.answer}
          /> */}
        <div className={styles.btn_container}>
          <CustomButton text={"Create Card"} onClick={() => createCard()} />
          <CustomButton
            text={"Back"}
            type={2}
            onClick={() => navigate("/flash-cards", {})}
          />
        </div>
        {/* {count < tempFlashcardData.length ? (
            <button onClick={nextCard} className="btn">
              Next Card
            </button>
          ) : (
            <button onClick={done} className="btn">
              Done
            </button>
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default FlashcardDesigner;
