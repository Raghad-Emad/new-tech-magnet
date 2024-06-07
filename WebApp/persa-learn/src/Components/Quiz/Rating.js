import React, { useState } from "react";
import styles from "./Rating.module.css";

import { AiFillStar } from "react-icons/ai";
import Rate from "../Rate";
import CustomButton from "../CustomButton";
import { rateQuiz } from "../../http_Requests/QuizRatingRequests";
import { useNavigate } from "react-router-dom";

const Rating = ({ quizID }) => {
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();

  const submitRating = async () => {
    const data = await rateQuiz({ quizID, rating });
    navigate("/", {});
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h2>How would you rate this activity?</h2>
        <Rate rating={rating} onRating={(rate) => setRating(rate)} />
        <CustomButton text={"Rate quiz"} onClick={submitRating} />
      </div>
    </div>
  );
};

export default Rating;
