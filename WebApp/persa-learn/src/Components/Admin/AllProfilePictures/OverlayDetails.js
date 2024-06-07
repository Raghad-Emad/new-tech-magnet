import React, { useState } from "react";
import { deleteProfilePictureAdmin } from "../../../http_Requests/StudentRequests/ItemRequests";
import CustomButton from "../../CustomButton";
import OverlayConfirm from "../../OverlayConfirm";
import styles from "./OverlayDetails.module.css";
import OverlayEdit from "./OverlayEdit";

const OverlayDetails = ({
  selectedProfilePicture,
  getProfilePictures,
  close,
}) => {
  const [showEdit, setShowEdit] = useState();
  const [isDeleting, setIsDeleting] = useState();

  console.log(selectedProfilePicture);
  const deleteProfilePic = async () => {
    const data = await deleteProfilePictureAdmin({
      ProfilePicID: selectedProfilePicture.id,
    });
    console.log(data);
    getProfilePictures();
    close();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${selectedProfilePicture.image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <h1>{selectedProfilePicture.name}</h1>
        <p>{selectedProfilePicture.details}</p>
        <p>cost: {selectedProfilePicture.cost}</p>
        <p>Required Level: {selectedProfilePicture.requiredLevel}</p>
        <CustomButton text={"Edit"} onClick={() => setShowEdit(true)} />
        <CustomButton text={"Delete"} onClick={() => setIsDeleting(true)} />
        <CustomButton text={"Back"} type={2} onClick={close} />
      </div>
      {showEdit ? (
        <OverlayEdit
          ProfilePicID={selectedProfilePicture.id}
          close={() => setShowEdit(false)}
          getProfilePictures={() => {
            getProfilePictures();
            setShowEdit(false);
            close();
          }}
        />
      ) : (
        <></>
      )}
      {isDeleting ? (
        <OverlayConfirm
          message={"Are you sure you want to delete this profile?"}
          yes={deleteProfilePic}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default OverlayDetails;
