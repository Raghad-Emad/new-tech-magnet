import React from "react";
import styles from "./ShopItem.module.css";

const ShopItem = ({
  itemID,
  type,
  image,
  name,
  details,
  cost = 0,
  requiredLevel,
  primary = "black",
  secondary = "white",
  itemSelected,
  isPurchased,
}) => {
  return (
    <div
      className={styles.item}
      tabindex="0"
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
          isPurchased,
          requiredLevel,
        })
      }
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          itemSelected({
            itemID,
            type,
            image,
            details,
            name,
            cost,
            isPurchased,
            requiredLevel,
          });
        }
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
        {type === "Theme" ? (
          <div
            className={styles.outer_color}
            style={{ backgroundColor: secondary }}
          >
            <div
              className={styles.inner_color}
              style={{ backgroundColor: primary }}
            ></div>
          </div>
        ) : (
          <></>
        )}
        <p>Select</p>
      </div>
      <p>{name}</p>
      <p>{cost} coins</p>
      {isPurchased ? <h3 className={styles.purchased}>Purchased</h3> : <></>}
    </div>
  );
};

export default ShopItem;
