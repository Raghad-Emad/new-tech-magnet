import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserSettings.module.css";

import studentIcon from "../assets/UserIcons/001-man-1.png";
import CustomButton from "../Components/CustomButton";
import { MdEdit } from "react-icons/md";

// import getUserDetails from "../"
import { getUserDetails } from "../http_Requests/userRequests";
import ProfilePictureSelector from "../Components/UserSettings/ProfilePictureSelector";
import BannerSelector from "../Components/UserSettings/BannerSelector";
import ThemeCurrent from "../Components/UserSettings/ThemeCurrent";
import ThemeSelector from "../Components/UserSettings/ThemeSelector";
import OverlayConfirm from "../Components/OverlayConfirm";
import { deleteStudent } from "../http_Requests/StudentRequests/StudentRequests";
import OverlayChangePassword from "../Components/UserSettings/OverlayChangePassword";

const UserSettings = () => {
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [banner, setBanner] = useState();

  const [isSelectProfilePic, setIsSelectProfilePic] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelectBanner, setIsSelectBanner] = useState(false);
  const [isSelectTheme, setIsSelectTheme] = useState(false);

  const navigate = useNavigate();

  const getDetails = async () => {
    const data = await getUserDetails();

    if (data.status === "success") {
      const { FirstName, LastName, Email, ProfilePicture, Banner } = data.data;
      setEmail(Email);
      setFirstName(FirstName);
      setLastName(LastName);
      setProfilePicture(ProfilePicture);
      setBanner(Banner);
    }
  };

  //get user details from api on load
  useEffect(async () => {
    await getDetails();
  }, []);
  const deleteAccount = async () => {
    const data = await deleteStudent();
    if (data.status === "success") {
      navigate("/", {});
      sessionStorage.clear();
      window.location.reload();
    }
  };
  return (
    <div className="content-box">
      {/* <div className="container wide-container center-container"> */}
      {/* <div className={styles.container}> */}
      <h1>User Settings</h1>
      <div className={styles.container}>
        <h3>Profile picture</h3>
        <div
          className={styles.profilePicture}
          style={{
            backgroundImage: `url(${profilePicture})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          title="Profile Picture"
        >
          <MdEdit
            className={styles.editIcon}
            onClick={() => setIsSelectProfilePic(true)}
          />
        </div>
        
        <h2>Personal Infrmation</h2>
        <h3>Email</h3>
        <p>{email}</p>
        <h3>Firstname</h3>
        <p>{firstName}</p>
        <h3>Lastname</h3>
        <p>{lastName}</p>
        <CustomButton
          type={1}
          text={"Update details"}
          onClick={() =>
            navigate("/user_settings/edit", {
              state: {
                firstName: firstName,
                lastName: lastName,
                email: email,
              },
            })
          }
        />
        <CustomButton
          text={"Change password"}
          onClick={() => setIsChangePassword(true)}
        />
        <CustomButton
          type={2}
          text={"Delete my account"}
          onClick={() => setIsDeleting(true)}
        />
      </div>
      {isSelectProfilePic ? (
        <ProfilePictureSelector
          close={() => setIsSelectProfilePic(false)}
          getDetails={getDetails}
        />
      ) : (
        <></>
      )}
      {isSelectBanner ? (
        <BannerSelector
          close={() => setIsSelectBanner(false)}
          getDetails={getDetails}
        />
      ) : (
        <></>
      )}
      {isSelectTheme ? (
        <ThemeSelector
          // getDetails={getDetails}
          close={() => setIsSelectTheme(false)}
        />
      ) : (
        <></>
      )}
      {isDeleting ? (
        <OverlayConfirm
          message={`Are you sure you'd like to delete this account (${email})?`}
          yes={deleteAccount}
          no={() => setIsDeleting(false)}
        />
      ) : (
        <></>
      )}
      {isChangePassword ? (
        <OverlayChangePassword close={() => setIsChangePassword(false)} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserSettings;
