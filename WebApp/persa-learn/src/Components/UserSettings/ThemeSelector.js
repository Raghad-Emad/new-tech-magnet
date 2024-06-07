import React, { useState, useEffect } from "react";
import { getPurchasedThemes } from "../../http_Requests/StudentRequests/ItemRequests";
import CustomButton from "../CustomButton";
import ThemeSelect from "./ThemeSelect";
import styles from "./ThemeSelector.module.css";

const ThemeSelector = ({ close }) => {
  const [selectedTheme, setSelectedTheme] = useState({});
  const [themes, setThemes] = useState([]);

  const setTheme = (
    id,
    backgroundColor = "white",
    primaryColor = "#201d95",
    btnTextColor = "white",
    isDark = false
  ) => {
    setSelectedTheme({
      id,
      backgroundColor,
      primaryColor,
      btnTextColor,
      isDark,
    });
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--btn-text-color",
      btnTextColor
    );
    document.documentElement.style.setProperty(
      "--text-color",
      isDark ? "#c9d1d9" : "black"
    );
    document.documentElement.style.setProperty(
      "--items-container",
      isDark ? "rgba(255, 255, 255, 0.1)" : "rgb(0, 0, 0, 0.05)"
    );
    document.documentElement.style.setProperty(
      "--box-shadow-color",
      isDark ? "black" : "black"
    );
  };

  const resetTheme = () => {
    let theme = JSON.parse(localStorage.getItem("theme"));
    if (theme) {
      setTheme(
        theme.id,
        theme.backgroundColor,
        theme.primaryColor,
        theme.btnTextColor,
        theme.isDark
      );
    } else setTheme();
  };

  useEffect(async () => {
    const data = await getPurchasedThemes();
    console.log(data);

    console.log("all the themes!", data);
    console.log("accessed from local storage");
    setThemes(data.data);

    //get selected theme from local storage
    let theme = JSON.parse(localStorage.getItem("theme"));
    if (theme) {
      setSelectedTheme(theme);
    }
  }, []);

  const themeSelected = (
    id,
    backgroundColor,
    primaryColor,
    btnTextColor,
    isDark
  ) => {
    setTheme(id, backgroundColor, primaryColor, btnTextColor, isDark);
  };

  const updateTheme = () => {
    localStorage.setItem("theme", JSON.stringify(selectedTheme));
    close();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2>Select a Theme</h2>
        <div className={styles.all_themes_container}>
          {themes.map((theme) => {
            return (
              <ThemeSelect
                key={theme.ThemeID}
                id={theme.ThemeID}
                themeSelected={themeSelected}
                selected={theme.ThemeID == selectedTheme.id}
                backgroundColor={theme.BackgroundColor}
                primaryColor={theme.PrimaryColor}
                btnTextColor={theme.BtnTextColor}
                isDark={
                  theme.IsDark == "true" || theme.IsDark == true ? true : false
                }
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
          <CustomButton text={"Confirm"} onClick={updateTheme} />
          {/* <CustomButton text={"Get more"} onClick={null} /> */}
          <CustomButton
            text={"Back"}
            type={2}
            onClick={() => {
              resetTheme();
              close();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
