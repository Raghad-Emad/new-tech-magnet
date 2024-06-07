import React, { useState, useEffect } from "react";
import CustomButton from "../../CustomButton";
import CustomInput from "../../CustomInput";
import styles from "./OverlayEdit.module.css";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import {
  editProfilePictureAdmin,
  getProfilePictureDetails,
} from "../../../http_Requests/StudentRequests/ItemRequests";

const OverlayEdit = ({ ProfilePicID, close, getProfilePictures }) => {
  const [isMagnified, setIsMagnified] = useState(false);
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [cost, setCost] = useState("");
  const [requiredLevel, setRequiredLevel] = useState("");
  console.log(ProfilePicID);

  const editDetails = async () => {
    console.log(id);
    const data = await editProfilePictureAdmin({
      ProfilePicID: id,
      Name: name,
      Details: details,
      Image: image,
      Cost: cost,
      RequiredLevel: requiredLevel,
    });
    if (data.status == "success") {
      getProfilePictures();
      // close();
    }
  };

  const getDetails = async () => {
    let data = await getProfilePictureDetails(ProfilePicID);
    if (data.status == "success") {
      data = data.data[0];
      console.log(data);
      //   console.log(data.data);
      setID(data.ProfilePictureID);
      setName(data.Name);
      setDetails(data.Details != null ? data.Details : "");
      setImage(data.Image);
      setCost(data.Cost);
      setRequiredLevel(data.RequiredLevel);
    }
  };
  useEffect(async () => {
    await getDetails();
  }, []);
  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>Edit Profile Picture</h1>
        <h2>Name</h2>
        <CustomInput setValue={setName} value={name} />
        <h2>Details</h2>
        <CustomInput setValue={setDetails} value={details} />
        <h2>Image</h2>
        <CustomInput setValue={setImage} value={image} />
        <div
          className={styles.previewImage}
          onClick={() => setIsMagnified(!isMagnified)}
        >
          <p>Preview Image</p>
          <div
            className={styles.image}
            style={Object.assign(isMagnified ? { transform: "scale(2)" } : {}, {
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            })}
          >
            <p>{isMagnified ? <MdZoomOut /> : <MdZoomIn />}</p>
          </div>
        </div>
        <h2>Cost</h2>
        <CustomInput setValue={setCost} value={cost} />
        <h2>Required Level</h2>
        <CustomInput setValue={setRequiredLevel} value={requiredLevel} />
        <CustomButton text={"Save Theme"} onClick={editDetails} />
        <CustomButton text={"Back"} type={2} onClick={close} />
      </div>
    </div>
  );
};

export default OverlayEdit;
