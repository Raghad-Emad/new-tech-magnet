import React, { useState } from "react";
import { purchaseTheme } from "../../../http_Requests/StudentRequests/ItemRequests";
import CustomButton from "../../CustomButton";
import OverlayConfirm from "../../OverlayConfirm";
import styles from "./ThemeOverlay.module.css";
const ThemeOverlay = ({ selectedItem = {}, getItems, close }) => {
  console.log(selectedItem);
  const [isPoor, setIsPoor] = useState();

  const buyItem = async () => {
    // attempt to buy item
    const data = await purchaseTheme({
      ThemeID: selectedItem.itemID,
    });
    // const data = {};
    console.log(data);
    //not successful
    if (Array.isArray(data.results)) {
      //not enough money
      if (data.results[0][0].hasOwnProperty("Error")) {
        // console.log("Youre too poor");
        setIsPoor(true);
      }
    } else if (data.status === "success") {
      // successful
      getItems();
      close();
    }
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h2>Banner</h2>
        <div className={styles.image}>
          <div
            className={styles.primary}
            style={{ backgroundColor: selectedItem.primary }}
          >
            <div
              className={styles.background}
              style={{ backgroundColor: selectedItem.background }}
            >
              <p
                className={styles.test_text}
                style={
                  selectedItem.isDark == false || selectedItem.isDark == "false"
                    ? { color: "black" }
                    : { color: "white" }
                }
              >
                abc
              </p>
            </div>
          </div>
        </div>
        <h3>{selectedItem.name}</h3>
        <p>{selectedItem.details}</p>
        <p>
          <b>{selectedItem.cost} Coins</b>
        </p>
        <p>
          <b>lvl {selectedItem.requiredLevel}</b>
        </p>
        {selectedItem.isPurchased ? (
          <h3>Already Purchased</h3>
        ) : (
          <CustomButton text={"Buy"} onClick={buyItem} />
        )}
        <CustomButton text={"Back"} type={2} onClick={close} />
      </div>
      {isPoor ? (
        <OverlayConfirm
          message={"Sorry you don't have enough coins or level"}
          yes={() => setIsPoor(false)}
          type={2}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ThemeOverlay;
