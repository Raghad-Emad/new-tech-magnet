import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import {
  deleteFlashCard,
  getFlashCards,
  updateFlashCard,
} from "../../../http_Requests/StudentRequests/FlashCardRequests";
import EditCardItem from "./EditCardItem";
import OverlayConfirm from "../../../Components/OverlayConfirm";
import styles from "./EditCardsInDeck.module.css";

const EditCardsInDeck = () => {
  const { state } = useLocation();
  const [deck, setDeck] = useState([]);
  // const [isEditing, setIsEditing] = useState([]);
  const [u, setU] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState();
  const [isDeleteing, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const deleteCard = (id) => {
    console.log("Deleting card");
    setSelectedCardId(id);
    setIsDeleting(true);
  };

  const deleteConfirmed = async () => {
    console.log("Deleting card: ", selectedCardId);
    const data = await deleteFlashCard({ FlashCardID: selectedCardId });
    console.log(data);
    if (data.status === "success") {
      setIsDeleting(false);
      await getCards();
    } else console.log("Something went wrong");
  };

  const getCards = async () => {
    const data = await getFlashCards(state);
    console.log(data);
    setDeck(data.flashCards);
  };

  useEffect(async () => {
    await getCards();
  }, []);

  return (
    <div className="content-box">
      <h1>Flash cards</h1>
      <div className={styles.container}>
        <div className={styles.title_container}>
          <h2>Deck: {state.Name}</h2>
        </div>
        <div className={styles.cards_container}>
          {deck.map((card, i) => (
            <EditCardItem
              q={card.Question}
              a={card.Answer}
              id={card.CardID}
              key={card.CardID}
              deleteCard={deleteCard}
            />
          ))}
        </div>
        <CustomButton
          text={"Add Card"}
          onClick={() => {
            navigate("/designer_flashcard", {
              state,
            });
          }}
        />
        <CustomButton
          text={"Back"}
          type={2}
          onClick={() => {
            navigate("/flash-cards", {
              state,
            });
          }}
        />
      </div>
      {isDeleteing ? (
        <OverlayConfirm
          message={"Are you sure you want to delete this card?"}
          yes={deleteConfirmed}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditCardsInDeck;
