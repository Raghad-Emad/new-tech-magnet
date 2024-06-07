import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import AlertOverlay from "../../Components/Overlays/AlertOverlay";
import {
  editThemeAdmin,
  getThemeDetails,
} from "../../http_Requests/StudentRequests/ItemRequests";
import styles from "./ThemesEdit.module.css";

const ThemesEdit = () => {
  const [themeID, setThemeID] = useState();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [btnTextColor, setBtnTextColor] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [cost, setCost] = useState("");
  const [requiredLevel, setRequiredLevel] = useState("");

  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(async () => {
    setThemeID(state.ThemeID);
    console.log(state.ThemeID);
    // get themes details
    const data = await getThemeDetails(state.ThemeID);
    console.log(data);
    console.log(data.data[0]);
    if (data.status === "success") {
      setName(data.data[0].Name);
      setDetails(data.data[0].Details);
      setPrimaryColor(data.data[0].PrimaryColor);
      setBackgroundColor(data.data[0].BackgroundColor);
      setBtnTextColor(data.data[0].BtnTextColor);

      setIsDark(data.data[0].IsDark == "true" || data.data[0].IsDark == true);
      setCost(data.data[0].Cost);
      setRequiredLevel(data.data[0].RequiredLevel);
    }
  }, []);

  const editTheme = async () => {
    const data = await editThemeAdmin({
      ThemeID: themeID,
      Name: name,
      Details: details,
      PrimaryColor: primaryColor,
      BackgroundColor: backgroundColor,
      BtnTextColor: btnTextColor,
      IsDark: isDark,
      Cost: cost,
      ReqLevel: requiredLevel,
    });
    if (data.status === "success") {
      navigate("/themes", {});
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="content-box">
      <h1>Create Themes</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        {/* <h2>Create Theme</h2> */}
        <h3>Name</h3>
        <CustomInput setValue={setName} value={name} />
        <h3>Details</h3>
        <CustomInput setValue={setDetails} value={details} />
        <h3>Primary Color</h3>
        <CustomInput setValue={setPrimaryColor} value={primaryColor} />
        <h3>Background Color</h3>
        <CustomInput setValue={setBackgroundColor} value={backgroundColor} />
        <h3>Button Text</h3>
        <CustomInput setValue={setBtnTextColor} value={btnTextColor} />
        <h3>Light/Dark</h3>
        <div>
          <input
            type="radio"
            id="light"
            name="mode"
            value={false}
            checked={isDark == false}
            onChange={() => {
              setIsDark(false);
            }}
          />
           <label htmlFor="light">Light</label>
          <input
            type="radio"
            id="dark"
            name="mode"
            value={true}
            checked={isDark == true}
            onChange={() => {
              setIsDark(true);
            }}
          />
           <label htmlFor="dark">Dark</label> 
        </div>
        <h3>Cost</h3>
        <CustomInput setValue={setCost} value={cost} />
        <h3>Required Level</h3>
        <CustomInput setValue={setRequiredLevel} value={requiredLevel} />

        <CustomButton text={"Edit Theme"} onClick={editTheme} />
      </div>
      {isError ? (
        <AlertOverlay
          message={"Unable to update theme"}
          ok={() => setIsError(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ThemesEdit;
