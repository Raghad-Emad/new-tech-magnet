import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../CustomButton";
import styles from "./ShopManagement.module.css";
const ShopManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="content-box">
      <h1>Shop Management</h1>
      <div className={styles.container}>
        <h2>Select an item type</h2>
        <CustomButton
          text={"Banners"}
          onClick={() => navigate("/banners", {})}
        />
        <CustomButton
          text={"Profile Pictures"}
          onClick={() => navigate("/profilePictures", {})}
        />
        <CustomButton text={"Themes"} onClick={() => navigate("/themes", {})} />
      </div>
    </div>
  );
};

export default ShopManagement;
