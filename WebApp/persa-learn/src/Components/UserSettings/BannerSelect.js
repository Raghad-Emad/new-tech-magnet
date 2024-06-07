import React from "react";
import styles from "./BannerSelect.module.css";

const BannerSelect = ({ image, selected, bannerSelected }) => {
  return (
    <div
      className={styles.picture_container}
      style={selected ? { borderColor: "green" } : {}}
      onClick={() => bannerSelected(image)}
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
    </div>
  );
};

export default BannerSelect;
