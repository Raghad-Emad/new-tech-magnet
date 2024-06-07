import React, { useState, useEffect } from "react";
import OverlayAdd from "../../Components/Admin/AllProfilePictures/OverlayAdd";
import OverlayDetails from "../../Components/Admin/AllProfilePictures/OverlayDetails";
import ProfilePicture from "../../Components/Admin/AllProfilePictures/ProfilePicture";
import CustomButton from "../../Components/CustomButton";
import { getAllProfilePicturesAdmin } from "../../http_Requests/StudentRequests/ItemRequests";
import styles from "./ProfilePicturesAll.module.css";

const ProfilePicturesAll = () => {
  const [allProfilePictures, setAllProfilePictures] = useState([]);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const getProfilePictures = async () => {
    const data = await getAllProfilePicturesAdmin();
    console.log(data);
    if (data.status == "success") {
      setAllProfilePictures(data.data);
    }
  };

  useEffect(async () => {
    await getProfilePictures();
  }, []);

  const profilePictureSelected = (
    Id,
    Name,
    Details,
    Image,
    Cost,
    RequiredLevel
  ) => {
    setSelectedProfilePicture(Id, Name, Details, Image, Cost, RequiredLevel);
    setShowDetails(true);
  };
  return (
    <div className="content-box">
      <h1>All Profile Pictures</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Profile Pictures</h2>
        <div className={styles.profile_pictures_container}>
          {allProfilePictures.map((profilePic) => (
            <ProfilePicture
              key={profilePic.ProfilePictureID}
              id={profilePic.ProfilePictureID}
              name={profilePic.Name}
              details={profilePic.Details}
              image={profilePic.Image}
              cost={profilePic.Cost}
              requiredLevel={profilePic.RequiredLevel}
              profilePictureSelected={profilePictureSelected}
            />
          ))}
          {/* <ProfilePicture profilePictureSelected={profilePictureSelected} /> */}
          <CustomButton
            text={"Add Theme"}
            type={3}
            floating={true}
            onClick={() => setShowAdd(true)}
          />
        </div>
      </div>
      {showDetails ? (
        <OverlayDetails
          selectedProfilePicture={selectedProfilePicture}
          getProfilePictures={getProfilePictures}
          close={() => setShowDetails(false)}
        />
      ) : (
        <></>
      )}
      {showAdd ? (
        <OverlayAdd
          getProfilePictures={() => {
            getProfilePictures();
            setShowAdd(false);
          }}
          close={() => setShowAdd(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfilePicturesAll;
