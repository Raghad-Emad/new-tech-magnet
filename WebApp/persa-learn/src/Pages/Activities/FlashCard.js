import React, { useState, useEffect } from "react";
import Flashcard from "../../Components/FlashCards/Flashcard";
import styles from "./FlashCard.module.css";

import tempFlashcardData from "../../assets/tempFlashcardData.json";
import { useLocation } from "react-router-dom";
import { getFlashCards } from "../../http_Requests/StudentRequests/FlashCardRequests";
import CustomButton from "../../Components/CustomButton";
import AlertOverlay from "../../Components/Overlays/AlertOverlay";
import { useNavigate } from "react-router-dom";

const FlashCard = () => {
  const [deck, setDeck] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  // const [currentCard, setCurrentCard] = useState(tempFlashcardData[0]);
  const [currentCard, setCurrentCard] = useState(null);
  const [count, setCount] = useState(1);
  const [score, setScore] = useState(0);
  const [numCards, setNumCards] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const { state } = useLocation();
  console.log(state);
  console.log("the cur", currentCard);

  const navigate = useNavigate();

  useEffect(async () => {
    const data = await getFlashCards(state);
    console.log(data);
    setDeck(data.flashCards);
    // setCurrentCard(deck[0]);
  }, []);
  useEffect(async () => {
    console.log(deck);
    setNumCards(deck.length);

    setCurrentCard(deck[0]);
    console.log(currentCard);
  }, [deck]);

  const nextCard = () => {
    console.log(count);
    if (count < numCards) {
      setCount(count + 1);
      setCurrentCard(deck[count]);
      console.log(count, currentCard);
    } else {
      setIsComplete(true);
    }
  };
  const done = () => {
    alert("done");
  };
  const correct = () => {
    console.log("correct");
    setScore(score + 1);
    nextCard();
  };
  const incorrect = () => {
    console.log("incorrect");
    nextCard();
  };
  return (
    <div className="content-box">
      <h1>Flash Card!</h1>
      <div className={styles.container}>
        {/* <div> */}
        <div className={styles.title_container}>
          <h2>{state.Name}</h2>
          <div className={styles.row}>
            <h3>Score: {score}</h3>
            <h3>Cards Remaining: {tempFlashcardData.length - count - 1}</h3>
          </div>
        </div>
        {console.log("current ", currentCard)}
        {currentCard != null ? (
          <Flashcard
            question={currentCard.Question}
            answer={currentCard.Answer}
            setIsFlipped={setIsFlipped}
          />
        ) : (
          <></>
        )}

        <CustomButton
          disabled={!isFlipped}
          text={"Correct"}
          onClick={() => correct()}
        />
        <CustomButton
          disabled={!isFlipped}
          text={"Incorrect"}
          onClick={() => incorrect()}
        />

        {/* <button className="btn">Flip card</button> */}
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
      {isComplete ? (
        <AlertOverlay
          message={`Scored ${score}/${deck.length}`}
          ok={() => navigate("/flash-cards", {})}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default FlashCard;
