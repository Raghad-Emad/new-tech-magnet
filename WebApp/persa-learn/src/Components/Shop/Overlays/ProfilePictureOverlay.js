import React, { useState } from "react";
import { purchaseProfilePic } from "../../../http_Requests/StudentRequests/ItemRequests";
import CustomButton from "../../CustomButton";
import OverlayConfirm from "../../OverlayConfirm";
import styles from "./ProfilePictureOverlay.module.css";

const ProfilePictureOverlay = ({ selectedItem, getItems, close }) => {
  const [isPoor, setIsPoor] = useState();

  // console.log(selectedItem);

  const buyItem = async () => {
    // attempt to buy item
    const data = await purchaseProfilePic({
      ProfilePictureID: selectedItem.itemID,
    });
    console.log(data);
    //not successful
    console.log(Array.isArray(data.results));
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
        <h2>Profile Picture</h2>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${selectedItem.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* {selectedItem.image} */}
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
        <OverlayConfirm //TODO: fix
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

export default ProfilePictureOverlay;
