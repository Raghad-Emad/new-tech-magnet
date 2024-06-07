import React, { useState, useEffect } from "react";
import { getPurchasedProfilePictures } from "../../http_Requests/StudentRequests/ItemRequests";
import { updateProfilePicture } from "../../http_Requests/StudentRequests/StudentRequests";
import CustomButton from "../CustomButton";
import IconSelect from "./IconSelect";
import styles from "./ProfilePictureSelector.module.css";

const ProfilePictureSelector = ({ close, getDetails }) => {
  const [selectedIcon, setSelectedIcon] = useState();
  const [profilePictures, setProfilePictures] = useState([]);

  const getProfilePictures = async () => {
    const data = await getPurchasedProfilePictures();
    console.log(data);
    if (data.status === "success") {
      setProfilePictures(data.data);
    }
  };

  useEffect(async () => {
    await getProfilePictures();
  }, []);

  const iconSelected = (image) => {
    setSelectedIcon(image);
  };
  const updatePicture = async () => {
    if (selectedIcon != null) {
      console.log("Profile picture changed to: ", selectedIcon);
      const data = await updateProfilePicture({ ProfilePicture: selectedIcon });
      console.log(data);
      await getDetails();
      close();
    } else alert("Select a profile picture");
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2>Select a profile picture</h2>
        <div className={styles.all_picture_container}>
          {profilePictures.map((image, i) => {
            console.log(image);
            return (
              <IconSelect
                image={image.Image}
                iconSelected={iconSelected}
                selected={selectedIcon === image.Image ? true : false}
                key={i}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <CustomButton text={"Confirm"} onClick={updatePicture} />
          <CustomButton text={"Back"} type={2} onClick={close} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSelector;
