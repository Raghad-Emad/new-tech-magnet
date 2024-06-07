import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OverlayDetails from "../../Components/Admin/AllThemes/OverlayDetails";
import Theme from "../../Components/Admin/AllThemes/Theme";
import CustomButton from "../../Components/CustomButton";
import { getAllThemesAdmin } from "../../http_Requests/StudentRequests/ItemRequests";
import styles from "./ThemesAll.module.css";

const ThemesAll = () => {
  const [allThemes, setAllThemes] = useState([]);
  const [showThemeDetails, setShowThemeDetails] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState();
  const navigate = useNavigate();

  const getThemes = async () => {
    const data = await getAllThemesAdmin();
    setAllThemes(data.data);
  };

  useEffect(async () => {
    await getThemes();
  }, []);

  const selectTheme = (
    id,
    name,
    details,
    primaryColor,
    backgroundColor,
    btnTextColor,
    isDark,
    cost,
    requiredLevel
  ) => {
    setSelectedTheme({
      id,
      name,
      details,
      primaryColor,
      backgroundColor,
      btnTextColor,
      isDark,
      cost,
      requiredLevel,
    });
    setShowThemeDetails(true);
  };
  return (
    <div className="content-box">
      <h1>All Themes</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Themes</h2>
        <div className={styles.themes_container}>
          {/* <Theme
            id={1}
            name={"Original"}
            primaryColor="blue"
            backgroundColor={"white"}
            isDark={false}
            cost={100}
            requiredLevel={2}
            selectTheme={selectTheme}
          /> */}
          {allThemes.map((theme) => (
            <Theme
              key={theme.ThemeID}
              id={theme.ThemeID}
              name={theme.Name}
              details={theme.Details}
              primaryColor={theme.PrimaryColor}
              backgroundColor={theme.BackgroundColor}
              btnTextColor={theme.BtnTextColor}
              isDark={
                theme.IsDark == "true" || theme.isDark == true ? true : false
              }
              cost={theme.Cost}
              requiredLevel={theme.RequiredLevel}
              selectTheme={selectTheme}
            />
          ))}

          <CustomButton
            text={"Add Theme"}
            type={3}
            floating={true}
            onClick={() => navigate("./add", {})}
          />
        </div>
      </div>
      {showThemeDetails ? (
        <OverlayDetails
          id={selectedTheme.id}
          name={selectedTheme.name}
          details={selectedTheme.details}
          primaryColor={selectedTheme.primaryColor}
          backgroundColor={selectedTheme.backgroundColor}
          btnTextColor={selectedTheme.btnTextColor}
          isDark={selectedTheme.isDark}
          cost={selectedTheme.cost}
          requiredLevel={selectedTheme.requiredLevel}
          close={() => {
            setShowThemeDetails(false);
            getThemes();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ThemesAll;
