import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../CustomButton";
import styles from "./OverlayComplete.module.css";

const OverlayComplete = ({ title, selectedClass }) => {
  const navigate = useNavigate();

  return (
    // <div className="overlay" aria-disabled={!isComplete}>
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>Created {title} Quiz</h1>
        <CustomButton
          text={"View All Quizzes"}
          onClick={() =>
            navigate("/Assign", {
              state: selectedClass,
            })
          }
        />
      </div>
    </div>
  );
};

export default OverlayComplete;
