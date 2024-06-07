import React, { useEffect, useState } from "react";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import { useNavigate } from "react-router-dom";

import {
  deleteFlashCardDecks,
  getNumFlashCard,
  updateFlashCardDecks,
} from "../../http_Requests/StudentRequests/FlashCardRequests";
import styles from "./OverlayDetails.module.css";
import OverlayConfirm from "../../Components/OverlayConfirm";

const OverlayDetails = ({ selectedDeck, close, getDecks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [numberCards, setNumberCards] = useState(0);
  const [newName, setNewName] = useState(selectedDeck.Name);
  const [status, setStatus] = useState({ error: false, message: "" });
  const navigate = useNavigate();

  useEffect(async () => {
    // get number of cards
    const data = await getNumFlashCard({ DeckID: selectedDeck.DeckID });
    if (data.status === "success") {
      setNumberCards(data.numCards.NumberOfCards);
    } else console.log("Couldn't get number of cards");
  }, []);
  const editDeck = async () => {
    if (newName != null && newName != "") {
      const data = await updateFlashCardDecks({
        DeckID: selectedDeck.DeckID,
        Name: newName,
      });
      if (data.status === "success") {
        setStatus({ error: false, message: "Name Updated" });
        getDecks();
      }
    } else setStatus({ error: true, message: "Please enter a name" });
  };
  const deleteDeck = async () => {
    const data = await deleteFlashCardDecks({ DeckID: selectedDeck.DeckID });
    if (data.status === "success") {
      //refresh page
      getDecks();
      close();
    } else alert("an error occured when deleting the deck");
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        {isEditing ? (
          <>
            <p>Name</p>
            {status.error ? (
              <p className={styles.error_message}>{status.message}</p>
            ) : (
              <p className={styles.success_message}>{status.message}</p>
            )}
            <CustomInput fill={true} setValue={setNewName} value={newName} />
            <CustomButton text={"Edit Deck"} onClick={() => editDeck()} />
            <CustomButton
              text={"Back"}
              type={2}
              onClick={() => setIsEditing(false)}
            />
          </>
        ) : (
          <>
            <h1>{selectedDeck.Name} Deck</h1>
            <p>Number cards: {numberCards}</p>
            <CustomButton
              disabled={numberCards === 0}
              text={"Play"}
              onClick={() =>
                navigate("/flash-card", {
                  state: selectedDeck,
                })
              }
            />
            <CustomButton
              text={"Edit"}
              onClick={() => {
                setIsEditing(true);
                setNewName(selectedDeck.Name);
              }}
            />
            <CustomButton
              text={"Edit Cards"}
              onClick={() =>
                navigate("/flash-card/edit", {
                  state: selectedDeck,
                })
              }
            />
            <CustomButton
              text={"Add Card"}
              onClick={() =>
                navigate("/designer_flashcard", {
                  state: selectedDeck,
                })
              }
            />
            <CustomButton
              text={"Delete Deck"}
              onClick={() => setIsDeleting(true)}
            />
            <CustomButton text={"Back"} onClick={close} type={2} />
          </>
        )}
      </div>
      {isDeleting ? (
        <OverlayConfirm
          message={`Are you sure you want to delete: ${selectedDeck.Name}`}
          yes={() => deleteDeck()}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default OverlayDetails;
