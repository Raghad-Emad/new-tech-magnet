import React, { useState } from "react";
import styles from "./IconSelect.module.css";

const IconSelect = ({ image, selected, iconSelected }) => {
  return (
    <div
      className={styles.picture_container}
      style={selected ? { borderColor: "green" } : {}}
      onClick={() => iconSelected(image)}
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

export default IconSelect;
