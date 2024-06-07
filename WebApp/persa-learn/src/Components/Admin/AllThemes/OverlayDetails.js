import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteThemeAdmin } from "../../../http_Requests/StudentRequests/ItemRequests";
import CustomButton from "../../CustomButton";
import OverlayConfirm from "../../OverlayConfirm";
import styles from "./OverlayDetails.module.css";

const OverlayDetails = ({
  id,
  name,
  details,
  primaryColor,
  backgroundColor,
  btnTextColor,
  isDark,
  cost,
  requiredLevel,
  close,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTheme = async () => {
    const data = await deleteThemeAdmin({ ThemeID: id });
    console.log(data);
    close();
  };

  const navigate = useNavigate();

  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>{name}</h1>
        <p>{details}</p>
        <div className={styles.theme_container}>
          <div
            className={styles.primary_color}
            style={{ backgroundColor: primaryColor }}
          >
            <div
              className={styles.background_color}
              style={{ backgroundColor: backgroundColor }}
            >
              <p style={isDark ? { color: "#c9d1d9" } : { color: "black" }}>
                abc
              </p>
            </div>
          </div>
        </div>
        <p>Cost {cost}</p>
        <p>Required Level {requiredLevel}</p>
        <CustomButton
          text={"Edit theme"}
          onClick={() =>
            navigate("/themes/edit", {
              state: {
                ThemeID: id,
              },
            })
          }
        />
        <CustomButton
          text={"Delete theme"}
          onClick={() => setIsDeleting(true)}
        />
        <CustomButton text={"Back"} type={2} onClick={close} />
      </div>
      {isDeleting ? (
        <OverlayConfirm
          message={"Are you sure you want to delete this theme?"}
          yes={deleteTheme}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default OverlayDetails;
