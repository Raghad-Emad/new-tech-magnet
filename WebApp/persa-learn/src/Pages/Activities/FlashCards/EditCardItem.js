import React, { useState } from "react";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import { updateFlashCard } from "../../../http_Requests/StudentRequests/FlashCardRequests";
import styles from "./EditCardItem.module.css";

const EditCardItem = ({ q, a, id, deleteCard }) => {
  const [question, setQuestion] = useState(q);
  const [answer, setAnswer] = useState(a);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState(question);
  const [newAnswer, setNewAnswer] = useState(answer);
  const [status, setStatus] = useState({ error: false, message: "" });

  const editCard = () => {
    setIsEditing(true);
  };
  const stopEditCard = () => {
    setIsEditing(false);
  };
  const saveEditCard = async () => {
    // console.log(
    //   `Saving card (${id}) new question: ${newQuestion}, new answers: ${newAnswer}`
    // );

    const data = await updateFlashCard({
      FlashCardID: id,
      Question: newQuestion,
      Answer: newAnswer,
    });

    if (data.status === "success") {
      setStatus({ error: false, message: "Editted successfully" });
      setQuestion(newQuestion);
      setAnswer(newAnswer);
      setIsEditing(false);
    } else {
      setStatus({ error: true, message: "An error occured please try again" });
    }
  };

  return (
    <div className={styles.card} key={id}>
      <div className={styles.front}>
        <h3>Question</h3>
        {isEditing ? (
          <>
            {status.error ? (
              <p className={styles.error}>{status.message}</p>
            ) : (
              <></>
            )}
            <CustomInput
              placeholder={"question"}
              setValue={setNewQuestion}
              value={newQuestion}
            />
          </>
        ) : (
          <>
            {!status.error ? (
              <p className={styles.success}>{status.message}</p>
            ) : (
              <></>
            )}
            <p>{question}</p>
          </>
        )}
      </div>
      <div className={styles.back}>
        <h3>Answer</h3>
        {isEditing ? (
          <>
            {status.error ? (
              <p className={styles.error}>{status.message}</p>
            ) : (
              <></>
            )}
            <CustomInput
              placeholder={"answer"}
              setValue={setNewAnswer}
              value={newAnswer}
            />
          </>
        ) : (
          <>
            {!status.error ? (
              <p className={styles.success}>{status.message}</p>
            ) : (
              <></>
            )}
            <p>{answer}</p>
          </>
        )}
      </div>
      <div className={styles.options}>
        {isEditing ? (
          <>
            <CustomButton
              text={"Save"}
              fill={true}
              onClick={() => saveEditCard()}
            />
            <CustomButton
              text={"Back"}
              fill={true}
              type={2}
              onClick={() => stopEditCard()}
            />
          </>
        ) : (
          <>
            <CustomButton
              text={"Edit"}
              fill={true}
              onClick={() => editCard()}
            />
            <CustomButton
              text={"Delete"}
              fill={true}
              onClick={() => deleteCard(id)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EditCardItem;
