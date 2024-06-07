import React from "react";
import styles from "./ThemeItem.module.css";
const ThemeItem = ({
  itemID,
  type,
  image,
  name,
  details,
  cost = 0,
  requiredLevel,
  primary = "black",
  background = "white",
  isDark = false,
  itemSelected,
  isPurchased,
}) => {
  return (
    <div
      className={styles.item}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      onClick={() =>
        itemSelected({
          itemID,
          type,
          image,
          details,
          name,
          cost,
          primary,
          background,
          isDark,
          isPurchased,
          requiredLevel,
        })
      }
      onKeyDown={(e) => {
        if (e.keyCode === 13)
          itemSelected({
            itemID,
            type,
            image,
            details,
            name,
            cost,
            primary,
            background,
            isDark,
            isPurchased,
            requiredLevel,
          });
      }}
      style={isPurchased ? { opacity: "0.5" } : {}}
    >
      <p>{type}</p>
      <div
        className={styles.image}
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className={styles.outer_color}
          style={{ backgroundColor: primary }}
        >
          <div
            className={styles.inner_color}
            style={{ backgroundColor: background }}
          >
            <p
              className={styles.sample_text}
              style={
                isDark == "true" || isDark == true
                  ? { color: "white" }
                  : { color: "black" }
              }
            >
              abc
            </p>
          </div>
        </div>

        <p className={styles.hover}>Select</p>
      </div>
      <p>{name}</p>
      <p>{cost} coins</p>
      {isPurchased ? <h3 className={styles.purchased}>Purchased</h3> : <></>}
    </div>
  );
};

export default ThemeItem;
