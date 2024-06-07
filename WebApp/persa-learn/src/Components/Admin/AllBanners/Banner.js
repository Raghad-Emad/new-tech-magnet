import React from "react";
import styles from "./Banner.module.css";

const Banner = ({
  id,
  name,
  details,
  image,
  cost,
  requiredLevel,
  bannerSelected,
}) => {
  return (
    <div
      className={styles.picture_container}
      onClick={() =>
        bannerSelected({ id, name, details, image, cost, requiredLevel })
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
      <p>Cost: {cost}</p>
      <p>Required Level: {requiredLevel}</p>
    </div>
  );
};

export default Banner;
