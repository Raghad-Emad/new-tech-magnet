import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import { addThemeAdmin } from "../../http_Requests/StudentRequests/ItemRequests";
import styles from "./ThemesAdd.module.css";

const ThemesAdd = () => {
  const [name, setName] = useState();
  const [details, setDetails] = useState();
  const [primaryColor, setPrimaryColor] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [btnTextColor, setBtnTextColor] = useState();
  const [isDark, setIsDark] = useState(false);
  const [cost, setCost] = useState();
  const [requiredLevel, setRequiredLevel] = useState();

  const navigate = useNavigate();

  const createTheme = async () => {
    const data = await addThemeAdmin({
      Name: name,
      Details: details,
      PrimaryColor: primaryColor,
      BackgroundColor: backgroundColor,
      BtnTextColor: btnTextColor,
      IsDark: isDark,
      Cost: cost,
      ReqLevel: requiredLevel,
    });
    console.log(data);
    navigate("/themes", {});
  };

  return (
    <div className="content-box">
      <h1>Create Themes</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        {/* <h2>Create Theme</h2> */}
        <h3>Name</h3>
        <CustomInput setValue={setName} />
        <h3>Details</h3>
        <CustomInput setValue={setDetails} />
        <h3>Primary Color</h3>
        <CustomInput setValue={setPrimaryColor} />
        <h3>Background Color</h3>
        <CustomInput setValue={setBackgroundColor} />
        <h3>Button Text</h3>
        <CustomInput setValue={setBtnTextColor} />
        <h3>Light/Dark</h3>
        <div onChange={(e) => setIsDark(e.target.value)}>
          <input
            type="radio"
            id="light"
            name="mode"
            value={false}
            defaultChecked
          />
           <label htmlFor="light">Light</label>
            <input type="radio" id="dark" name="mode" value={true} /> 
          <label htmlFor="dark">Dark</label> 
        </div>
        <h3>Cost</h3>
        <CustomInput setValue={setCost} />
        <h3>Required Level</h3>
        <CustomInput setValue={setRequiredLevel} />

        <CustomButton text={"Create Theme"} onClick={createTheme} />
      </div>
    </div>
  );
};

export default ThemesAdd;
