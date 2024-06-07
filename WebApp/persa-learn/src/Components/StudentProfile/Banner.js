import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect,
  Link,
} from "react-router-dom";
import styles from "./Banner.module.css";

import { FaCog } from "react-icons/fa";
import UserIcon from "./UserIcon";
import DetailsBox from "./DetailsBox";
import XpBox from "./XpBox";
import Progressbar from "./Progressbar";

const Banner = ({
  banner,
  level,
  profilePicture,
  usersName,
  coins,
  xp,
  requiredXp,
}) => {
  return (
    <div
      className={styles.banner}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "right",
      }}
    >
      <div className={styles.top}>
        <div className={styles.settings_btn}>
          <Link
            to="/user_settings"
            style={{ textDecoration: "none", zIndex: "999" }}
            aria-label="settings"
          >
            <FaCog />
          </Link>
        </div>
      </div>
      <div className={styles.upper}>
        <UserIcon level={level} studentIcon={profilePicture} />
        <DetailsBox username={usersName} coins={coins} />
        <XpBox xp={xp} requiredXp={requiredXp} />
      </div>
      {/* <Progressbar xp={xp} requiredXp={requiredXp} /> */}
    </div>
  );
};

export default Banner;
