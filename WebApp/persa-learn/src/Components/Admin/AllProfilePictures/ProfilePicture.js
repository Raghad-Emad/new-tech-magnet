import React from "react";
import styles from "./ProfilePicture.module.css";

const ProfilePicture = ({
  id,
  name,
  details,
  image,
  cost,
  requiredLevel,
  profilePictureSelected,
}) => {
  return (
    <div
      className={styles.picture_container}
      onClick={() =>
        profilePictureSelected({
          id,
          name,
          details,
          image,
          cost,
          requiredLevel,
        })
      }
    >
      <div
        className={styles.image}
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p>Select</p>
      </div>
      <p>{name}</p>
      <p>c{cost}</p>
      <p>r{requiredLevel}</p>
    </div>
  );
};

export default ProfilePicture;
